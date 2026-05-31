---
title: "Converting Text to Audiobooks with AI 2026 — ElevenLabs + Python Complete Guide"
date: 2026-06-01
author: "AIPlaybook Editorial Team"
category: "Audio"
tags: [tutorial, audiobooks, elevenlabs, tts, text-to-speech, python, audio-production]
cover: "/images/tutorials/ai-audiobooks-tutorial-2026/cover.png"
difficulty: intermediate
meta_description: "Build an automated audiobook production pipeline with ElevenLabs, Python, and FFmpeg. Convert any text into a narrated audiobook with chapter markers and voice cloning."
---

## Overview

Professional audiobook production costs $3,000-$10,000 per finished hour — a prohibitive barrier for independent authors, bloggers, and content creators. AI voice synthesis in 2026 has reached the quality inflection point where generated narration is indistinguishable from human recording for most non-fiction content. This tutorial walks you through building an automated audiobook pipeline that: ingests text from EPUB, PDF, or plain text files, generates ultra-realistic narration using ElevenLabs (with optional voice cloning), adds chapter markers and SSML tags for natural pacing, splits output into chapter files with proper metadata, and exports to M4B format (the standard for Audible/iBooks compatibility). The pipeline costs roughly $0.50 per hour of audio at ElevenLabs' API rates.

## Prerequisites

- Python 3.10+
- ElevenLabs account with API key (Starter plan $5/month or Pro $22/month for longer audio)
- FFmpeg installed: `brew install ffmpeg` (macOS) or `apt install ffmpeg` (Linux)
- `pip install elevenlabs python-dotenv pydub mutagen ebooklib beautifulsoup4`
- A source text: EPUB ebook, PDF, or plain text file (public domain works great for testing)
- Optional: a 3-minute clean voice recording for voice cloning
- 5GB+ free disk space for audio file processing

## Step 1: Extract and Clean Source Text

Start with text extraction and cleaning — dirty input produces worse narration.

```python
import re
from ebooklib import epub
from bs4 import BeautifulSoup
import PyPDF2  # For PDF support

class TextExtractor:
    def __init__(self, filepath):
        self.filepath = filepath
        self.chapters = []  # List of {title, text, index}
    
    def _clean_text(self, text):
        """Remove unwanted artifacts from extracted text."""
        text = re.sub(r'\s+', ' ', text)  # Normalize whitespace
        text = re.sub(r'[•●▪→■]', '', text)  # Remove bullets
        text = re.sub(r'http\S+', '[link omitted]', text)  # Replace URLs
        text = re.sub(r'\n{3,}', '\n\n', text)  # Normalize paragraph breaks
        return text.strip()
    
    def from_epub(self):
        """Extract chapters from EPUB format."""
        book = epub.read_epub(self.filepath)
        self.title = book.get_metadata('DC', 'title')[0][0] if book.get_metadata('DC', 'title') else "Untitled"
        
        for idx, item in enumerate(book.get_items()):
            if item.get_type() == 9:  # ITEM_DOCUMENT
                soup = BeautifulSoup(item.get_content(), 'html.parser')
                
                # Get chapter title from heading
                heading = soup.find(['h1', 'h2', 'h3'])
                chapter_title = heading.get_text().strip() if heading else f"Chapter {idx + 1}"
                
                # Get body text
                body = soup.find('body')
                text = body.get_text(' ', strip=True) if body else ''
                
                if len(text) > 100:  # Skip empty/near-empty pages
                    self.chapters.append({
                        "title": chapter_title,
                        "text": self._clean_text(text),
                        "index": idx
                    })
        
        return self
    
    def from_text(self):
        """Extract from plain text, splitting on chapter markers."""
        with open(self.filepath, 'r', encoding='utf-8') as f:
            text = f.read()
        
        # Try to split on common chapter patterns
        chapter_pattern = re.compile(
            r'(Chapter|CHAPTER|PART|SECTION)\s+(\d+|[IVXLCDM]+)[\n\r\s]+((?:[^\n]+\n?)*)',
            re.MULTILINE
        )
        matches = list(chapter_pattern.finditer(text))
        
        if matches:
            for idx, m in enumerate(matches):
                self.chapters.append({
                    "title": m.group(0).split('\n')[0].strip(),
                    "text": self._clean_text(m.group(3)),
                    "index": idx
                })
        else:
            # No chapter markers, treat as single chapter
            self.chapters.append({
                "title": "Full Text",
                "text": self._clean_text(text),
                "index": 0
            })
        
        return self
    
    def get_stats(self):
        total_chars = sum(len(c["text"]) for c in self.chapters)
        total_words = sum(len(c["text"].split()) for c in self.chapters)
        estimated_audio_minutes = total_words / 150  # ~150 words/min for narration
        return {
            "title": getattr(self, 'title', 'Untitled'),
            "chapters": len(self.chapters),
            "total_words": total_words,
            "total_chars": total_chars,
            "estimated_minutes": round(estimated_audio_minutes, 1)
        }

# Extract text from an EPUB
extractor = TextExtractor("sample_book.epub")
extractor.from_epub()
stats = extractor.get_stats()
print(f"Book: {stats['title']}")
print(f"{stats['chapters']} chapters, {stats['total_words']:,} words")
print(f"Estimated audio: {stats['estimated_minutes']} minutes")
```

## Step 2: Configure ElevenLabs Voice Settings

Voice selection dramatically affects listening experience. Let's build voice configuration:

```python
from elevenlabs import Voice, VoiceSettings, play, save
from elevenlabs.client import ElevenLabs
import time, os

client = ElevenLabs(api_key="sk-your-elevenlabs-key")

def list_available_voices():
    """List all ElevenLabs voices with their characteristics."""
    voices = client.voices.get_all()
    print("Available Voices:")
    for v in voices.voices:
        print(f"  • {v.name} (ID: {v.voice_id}) — {v.category}")
        if v.labels:
            print(f"    Tags: {', '.join(f'{k}: {v}' for k, v in v.labels.items())}")
    return voices

voices = list_available_voices()

def configure_narration_voice(voice_id=None):
    """Configure optimal voice settings for audiobook narration."""
    
    if not voice_id:
        # Rachel is a popular choice — warm, clear, natural
        voice_id = "21m00Tcm4TlvDq8ikWAM"  # Rachel's voice ID on ElevenLabs
    
    return Voice(
        voice_id=voice_id,
        settings=VoiceSettings(
            stability=0.35,     # Lower = more expressive (0-100%)
            similarity_boost=0.75,  # Higher = more accurate to original voice
            style=0.25,         # 0 = neutral narration, 1 = highly expressive
            use_speaker_boost=True  # Enhance presence/Clarity
        )
    )

narration_voice = configure_narration_voice()

# Test a sentence
audio = client.generate(
    text="This is a test of the audiobook narration voice. The quick brown fox jumps over the lazy dog.",
    voice=narration_voice,
    model="eleven_multilingual_v2"  # Best for long-form narration
)
save(audio, "voice_test.mp3")
print("Voice test saved to voice_test.mp3")
```

**Voice cloning (for custom narrator):**
If you want to clone a specific voice (your own, a voice actor you've licensed):
```python
def clone_voice(name, audio_files, description="Audiobook narrator"):
    """Clone a voice from audio samples."""
    voice = client.clone(
        name=name,
        description=description,
        audio_files=audio_files,  # List of file paths, 3+ min total
    )
    print(f"Cloned voice ID: {voice.voice_id}")
    return voice

# Usage: clone_voice("My Narrator", ["sample1.mp3", "sample2.mp3"])
```

## Step 3: Generate Narration with SSML Enhancements

SSML tags add natural pauses, emphasis, and pacing:

```python
import xml.etree.ElementTree as ET

def prepare_ssml(chapter_text, chapter_title):
    """Wrap text in SSML for natural narration pacing."""
    
    # Split into paragraphs
    paragraphs = chapter_text.split('\n\n')
    
    ssml_parts = [f'<speak>']
    ssml_parts.append(f'<p><s><emphasis level="strong">{chapter_title}</emphasis></s></p>')
    ssml_parts.append(f'<break time="1.5s"/>')
    
    for para in paragraphs[:50]:  # Limit paragraphs per request
        if not para.strip():
            continue
        
        # Split into sentences
        sentences = re.split(r'(?<=[.!?])\s+', para)
        ssml_parts.append('<p>')
        for sent in sentences:
            if len(sent) > 200:
                # Long sentences: add mid-sentence breaks
                midpoint = len(sent) // 2
                space_before = sent.rfind(' ', 0, midpoint)
                space_after = sent.find(' ', midpoint)
                split_point = space_after if (midpoint - space_before) > (space_after - midpoint) else space_before
                
                if split_point > 0:
                    first_half = sent[:split_point]
                    second_half = sent[split_point:]
                    ssml_parts.append(f'<s>{first_half}<break time="300ms"/>{second_half}</s>')
                else:
                    ssml_parts.append(f'<s>{sent}</s>')
            else:
                ssml_parts.append(f'<s>{sent}</s>')
        ssml_parts.append('</p>')
        ssml_parts.append(f'<break time="800ms"/>')
    
    ssml_parts.append('</speak>')
    return '\n'.join(ssml_parts)

def generate_chapter_audio(chapter, voice, output_dir="output", chunk_size=5000):
    """Generate audio for a single chapter, handling long text via chunking."""
    
    os.makedirs(output_dir, exist_ok=True)
    chapter_file = os.path.join(output_dir, f"chapter_{chapter['index']+1:02d}.mp3")
    
    # Split into chunks if chapter is very long
    text = chapter["text"]
    if len(text) > chunk_size * 5:  # Very long chapter
        chunks = []
        words = text.split()
        current_chunk = []
        current_len = 0
        
        for word in words:
            current_chunk.append(word)
            current_len += len(word) + 1
            if current_len > chunk_size:
                chunks.append(' '.join(current_chunk))
                current_chunk = []
                current_len = 0
        
        if current_chunk:
            chunks.append(' '.join(current_chunk))
        
        print(f"  Chapter split into {len(chunks)} chunks")
        
        # Generate each chunk
        temp_files = []
        for i, chunk_text in enumerate(chunks):
            audio = client.generate(
                text=chunk_text,
                voice=voice,
                model="eleven_multilingual_v2"
            )
            temp_file = os.path.join(output_dir, f"temp_{chapter['index']}_{i}.mp3")
            save(audio, temp_file)
            temp_files.append(temp_file)
            print(f"  Chunk {i+1}/{len(chunks)} generated")
            time.sleep(0.5)  # Rate limit protection
        
        # Concatenate with FFmpeg
        ffmpeg_inputs = '|'.join(temp_files)
        os.system(f'ffmpeg -y -i "concat:{ffmpeg_inputs}" -acodec copy "{chapter_file}"')
        
        # Cleanup temp files
        for tf in temp_files:
            os.remove(tf)
    else:
        # Short enough for single request
        ssml = prepare_ssml(text, chapter["title"])
        audio = client.generate(
            text=ssml,
            voice=voice,
            model="eleven_multilingual_v2"
        )
        save(audio, chapter_file)
    
    print(f"  ✓ Chapter {chapter['index']+1} saved: {chapter_file}")
    return chapter_file

# Generate all chapters
generated_files = []
for chapter in extractor.chapters:
    print(f"\nGenerating: {chapter['title']}")
    filepath = generate_chapter_audio(chapter, narration_voice)
    generated_files.append(filepath)
    print(f"Duration: ~{len(chapter['text'].split()) / 150:.1f} min estimated")
```

## Step 4: Add Chapter Metadata and Combine to M4B

M4B is the standard audiobook format with chapter markers:

```python
from mutagen.mp3 import MP3
from mutagen.id3 import ID3, APIC, TIT2, TPE1, TALB
import subprocess

def add_metadata_to_chapters(chapter_files, chapters, book_title, author):
    """Add ID3 tags to each chapter file."""
    
    for i, (filepath, chapter) in enumerate(zip(chapter_files, chapters)):
        audio = MP3(filepath, ID3=ID3)
        
        # Ensure ID3 tags exist
        if audio.tags is None:
            audio.add_tags()
        
        audio.tags.add(TIT2(encoding=3, text=chapter["title"]))
        audio.tags.add(TPE1(encoding=3, text=author))
        audio.tags.add(TALB(encoding=3, text=book_title))
        audio.tags.add(APIC(
            encoding=3,
            mime='image/jpeg',
            type=3,
            desc='Cover',
            data=open('cover.jpg', 'rb').read() if os.path.exists('cover.jpg') else b''
        ))
        audio.save()
    
    print(f"Metadata added to {len(chapter_files)} chapters")

def create_m4b(chapter_files, output_filename="audiobook.m4b"):
    """Combine chapter MP3s into single M4B audiobook with chapter markers."""
    
    # Create FFmpeg concat file
    with open("concat_list.txt", "w") as f:
        for filepath in chapter_files:
            f.write(f"file '{os.path.abspath(filepath)}'\n")
    
    # Generate chapter metadata for FFmpeg
    chapter_meta = ";FFMETADATA1\n"
    current_offset = 0
    for i, filepath in enumerate(chapter_files):
        audio = MP3(filepath)
        duration_ms = int(audio.info.length * 1000)
        chapter_meta += f"\n[CHAPTER]\nTIMEBASE=1/1000\n"
        chapter_meta += f"START={current_offset}\n"
        chapter_meta += f"END={current_offset + duration_ms}\n"
        chapter_meta += f"title={extractor.chapters[i]['title']}\n"
        current_offset += duration_ms
    
    with open("chapter_meta.txt", "w") as f:
        f.write(chapter_meta)
    
    # Convert to M4B with chapter markers
    cmd = [
        'ffmpeg', '-y',
        '-f', 'concat', '-safe', '0', '-i', 'concat_list.txt',
        '-i', 'chapter_meta.txt',
        '-map_metadata', '1',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-movflags', '+faststart',
        '-f', 'mp4',
        output_filename
    ]
    
    subprocess.run(cmd, check=True)
    print(f"Audiobook saved: {output_filename}")
    
    # Cleanup
    os.remove("concat_list.txt")
    os.remove("chapter_meta.txt")
    
    return output_filename

# Combine everything
book_title = stats["title"]
author = "AIPlaybook Publishing"

add_metadata_to_chapters(generated_files, extractor.chapters, book_title, author)
m4b_file = create_m4b(generated_files)
```

## Step 5: Build the Automation CLI

```python
import click

@click.command()
@click.argument('input_file', type=click.Path(exists=True))
@click.option('--voice', default='21m00Tcm4TlvDq8ikWAM', help='ElevenLabs voice ID')
@click.option('--author', default='Unknown Author', help='Author name for metadata')
@click.option('--output', default='audiobook.m4b', help='Output filename')
@click.option('--chunk-size', default=5000, help='Max characters per API call')
def cli(input_file, voice, author, output, chunk_size):
    """Convert a text file or EPUB to an M4B audiobook."""
    
    print(f"📖 Loading: {input_file}")
    extractor = TextExtractor(input_file)
    
    if input_file.endswith('.epub'):
        extractor.from_epub()
    elif input_file.endswith('.txt'):
        extractor.from_text()
    else:
        print("Unsupported format. Use .epub or .txt")
        return
    
    stats = extractor.get_stats()
    print(f"\n📊 Stats: {stats['chapters']} chapters, {stats['total_words']:,} words")
    print(f"⏱  Estimated: {stats['estimated_minutes']} minutes of audio")
    
    if stats['estimated_minutes'] > 300:
        print("⚠️  Warning: >5 hours. Consider batch processing.")
    
    print(f"\n🎙️ Narrating with voice ID: {voice}")
    narration_voice = configure_narration_voice(voice)
    
    generated_files = []
    total_start = time.time()
    
    for chapter in extractor.chapters:
        print(f"\nChapter {chapter['index']+1}: {chapter['title']}")
        filepath = generate_chapter_audio(
            chapter, narration_voice, 
            output_dir="temp_audio",
            chunk_size=chunk_size
        )
        generated_files.append(filepath)
    
    elapsed = time.time() - total_start
    print(f"\n⏱  Generation time: {elapsed:.1f}s ({stats['estimated_minutes']*60/elapsed:.1f}x real-time)")
    
    print(f"\n📦 Adding metadata...")
    add_metadata_to_chapters(generated_files, extractor.chapters, stats['title'], author)
    
    print(f"\n💿 Creating audiobook...")
    create_m4b(generated_files, output)
    
    print(f"\n✅ Done! Audiobook saved to: {output}")
    print(f"   File size: {os.path.getsize(output) / 1024 / 1024:.1f} MB")

if __name__ == '__main__':
    cli()
```

**Usage:**
```bash
python audiobook_cli.py sample_book.epub --author "Jane Austen" --output pride_and_prejudice.m4b
```

## What You've Built

You now have a complete automated audiobook production pipeline:
- Text extraction from EPUB and plain text formats
- ElevenLabs voice configuration with optimal narration settings
- SSML-enhanced generation with natural pacing and emphasis
- Chapter-by-chapter audio generation with automatic chunking for long chapters
- ID3 metadata tagging and M4B assembly with chapter markers
- CLI tool for one-command audiobook production

The pipeline converts an average novel (80k words, ~9 hours of audio) in about 30-60 minutes, costing $4-5 in ElevenLabs API fees.

## Troubleshooting

**ElevenLabs API returns "content_too_long" for large chapters:**
The ElevenLabs API has a character limit per request (~10k characters for multilingual_v2). The code already handles this via the `chunk_size` parameter — set it lower (e.g., 3000) if you still hit limits. Also ensure you're using `eleven_multilingual_v2` (supports longer context) rather than `eleven_monolingual_v1`.

**FFmpeg concat fails with "non-monotonous DTS":**
This happens when MP3 files have slightly different encoding parameters. Fix by re-encoding all files to consistent parameters first:
```bash
for f in temp_audio/chapter_*.mp3; do
  ffmpeg -y -i "$f" -acodec libmp3lame -ar 44100 -ab 128k "${f%.mp3}_fixed.mp3";
done
```

**Voice sounds flat/non-expressive for long texts:**
Reduce `stability` to 0.25 and increase `style` to 0.35 in the VoiceSettings. For fiction (dialogue-heavy), set style to 0.45-0.55. For non-fiction, keep style at 0.2-0.3 for professional, measured tone.

**Chapter markers not showing in Audible/Books app:**
Some apps require specific M4B format. Ensure you're using `-f mp4` (not `-f ipod`). For Audible, you may need to convert to AA/AAX format using Audacity. For Apple Books, M4B with the chapter metadata format shown in Step 4 works reliably.

**Audiobook is too quiet or volume fluctuates:**
Normalize after generation:
```bash
ffmpeg -i audiobook.m4b -af loudnorm=I=-16:LRA=11:TP=-1.5 audiobook_normalized.m4b
```

## Next Steps

- Add chapter intro/outro music using sound effect generation APIs
- Build a web UI with Gradio for non-technical users to upload and generate
- Implement batch processing for multiple books with a queue (Redis + Celery)
- Generate cover art automatically using DALL-E 3 or Midjourney from book description
- Distribute: upload to Audible ACX, Apple Books, or Kobo Writing Life
- Add Whisper-based verification: generate transcript of output audio and compare to source

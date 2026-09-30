"""
Script kompresi foto untuk website — jalankan LOKAL di komputer Anda,
bukan di server manapun, karena butuh akses folder assets/photos/ Anda.

Cara pakai:
1. Install Pillow (sekali saja):
     pip install Pillow
2. Taruh file ini di root folder project (sejajar dengan folder assets/)
3. Jalankan:
     python compress_photos.py
4. Script akan overwrite semua foto di assets/photos/ dengan versi terkompresi.
   (Disarankan backup folder foto asli dulu sebelum jalanin ini)

Target: max lebar/tinggi 1600px, kualitas JPEG 78 — biasanya turun dari
~3-4MB jadi ~150-350KB per foto tanpa penurunan kualitas visual yang kentara
di layar HP/laptop.
"""

import os
from PIL import Image

FOLDER = "assets/photos"
MAX_DIMENSION = 1600
JPEG_QUALITY = 78

def compress_image(path):
    try:
        img = Image.open(path)
        img = img.convert("RGB")  # handle PNG/HEIC yang punya alpha channel

        w, h = img.size
        if max(w, h) > MAX_DIMENSION:
            ratio = MAX_DIMENSION / max(w, h)
            new_size = (int(w * ratio), int(h * ratio))
            img = img.resize(new_size, Image.LANCZOS)

        img.save(path, "JPEG", quality=JPEG_QUALITY, optimize=True)
        return True
    except Exception as e:
        print(f"  GAGAL: {path} -> {e}")
        return False

def main():
    if not os.path.isdir(FOLDER):
        print(f"Folder '{FOLDER}' tidak ditemukan. Jalankan script ini dari root project.")
        return

    files = [f for f in os.listdir(FOLDER) if f.lower().endswith((".jpg", ".jpeg", ".png"))]
    if not files:
        print("Tidak ada foto ditemukan di", FOLDER)
        return

    total_before = 0
    total_after = 0

    print(f"Memproses {len(files)} foto...\n")

    for f in sorted(files):
        path = os.path.join(FOLDER, f)
        size_before = os.path.getsize(path)
        total_before += size_before

        ok = compress_image(path)

        size_after = os.path.getsize(path)
        total_after += size_after

        status = "OK" if ok else "SKIP"
        print(f"  [{status}] {f}: {size_before/1024:.0f}KB -> {size_after/1024:.0f}KB")

    print(f"\nTotal sebelum: {total_before/1024/1024:.1f}MB")
    print(f"Total sesudah: {total_after/1024/1024:.1f}MB")
    print(f"Hemat: {(1 - total_after/total_before)*100:.0f}%")

if __name__ == "__main__":
    main()

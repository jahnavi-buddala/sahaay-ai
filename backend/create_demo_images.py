import os
from PIL import Image, ImageDraw

def create_sample_images():
    upload_dir = os.path.join(os.path.dirname(__file__), "uploads")
    os.makedirs(upload_dir, exist_ok=True)

    samples = [
        ("demo_begumpet_waterlogging.jpg", (45, 65, 80), "Begumpet Underpass Waterlogging"),
        ("demo_tolichowki_flood.jpg", (50, 70, 75), "Tolichowki Drain Overflow"),
        ("demo_obstruction.jpg", (70, 85, 75), "Hitec City Tree Obstruction"),
        ("demo_pothole.jpg", (60, 65, 60), "Somajiguda Submerged Pothole"),
        ("demo_cleared.jpg", (100, 120, 110), "Panjagutta Junction Cleared"),
        ("demo_mehdipatnam_stale.jpg", (80, 80, 80), "Mehdipatnam Old Puddle")
    ]

    for fname, bg_color, title in samples:
        fpath = os.path.join(upload_dir, fname)
        if not os.path.exists(fpath):
            img = Image.new("RGB", (640, 360), color=bg_color)
            draw = ImageDraw.Draw(img)
            # Draw road perspective lines and water gradient
            draw.rectangle([0, 180, 640, 360], fill=(bg_color[0] - 15, bg_color[1] - 10, bg_color[2] + 20))
            # Water reflections
            draw.ellipse([140, 240, 500, 320], fill=(bg_color[0] + 30, bg_color[1] + 40, bg_color[2] + 50))
            draw.text((20, 20), f"Sahaay AI Civic Evidence Sample\n{title}", fill=(240, 245, 240))
            img.save(fpath, "JPEG")

if __name__ == "__main__":
    create_sample_images()

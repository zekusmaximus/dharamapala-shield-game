#!/usr/bin/env python3
"""
Image Optimization Script for Dharmapala Shield
Converts PNG images to WebP and creates optimized versions
"""

import os
import sys
from PIL import Image
import argparse

class ImageOptimizer:
    def __init__(self):
        self.input_dir = "assets/images"
        self.quality_settings = {
            'webp': 80,
            'png': 90,
            'jpeg': 85
        }
        self.max_dimensions = {
            'regular': (1024, 1024),
            'background': (1920, 1080)
        }
        
    def optimize_image(self, input_path, output_path, format_type='webp', quality=80, max_size=None):
        """Optimize a single image"""
        try:
            with Image.open(input_path) as img:
                # Convert RGBA to RGB for JPEG
                if format_type.lower() == 'jpeg' and img.mode == 'RGBA':
                    # Create white background
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                    img = background
                
                # Resize if needed
                if max_size:
                    img.thumbnail(max_size, Image.Resampling.LANCZOS)
                
                # Save with optimization
                save_kwargs = {'optimize': True}
                if format_type.lower() == 'webp':
                    save_kwargs['quality'] = quality
                    save_kwargs['method'] = 6  # Best compression
                elif format_type.lower() == 'jpeg':
                    save_kwargs['quality'] = quality
                elif format_type.lower() == 'png':
                    save_kwargs['compress_level'] = 9
                
                img.save(output_path, format=format_type.upper(), **save_kwargs)
                
                # Get file sizes
                original_size = os.path.getsize(input_path)
                optimized_size = os.path.getsize(output_path)
                reduction = ((original_size - optimized_size) / original_size) * 100
                
                print(f"✓ {os.path.basename(input_path)} -> {os.path.basename(output_path)}")
                print(f"  Size: {original_size:,} bytes -> {optimized_size:,} bytes ({reduction:.1f}% reduction)")
                
                return True
                
        except Exception as e:
            print(f"✗ Error optimizing {input_path}: {e}")
            return False
    
    def process_all_images(self):
        """Process all PNG images in the assets/images directory"""
        if not os.path.exists(self.input_dir):
            print(f"Error: {self.input_dir} directory not found")
            return
        
        png_files = [f for f in os.listdir(self.input_dir) if f.endswith('.png')]
        
        if not png_files:
            print("No PNG files found in assets/images")
            return
        
        print(f"Found {len(png_files)} PNG files to optimize")
        print("=" * 50)
        
        total_original = 0
        total_optimized = 0
        successful = 0
        
        for filename in png_files:
            input_path = os.path.join(self.input_dir, filename)
            base_name = os.path.splitext(filename)[0]
            
            # Determine if it's a background image
            is_background = 'background' in filename.lower()
            max_size = self.max_dimensions['background'] if is_background else self.max_dimensions['regular']
            
            # Create WebP version
            webp_path = os.path.join(self.input_dir, f"{base_name}_optimized.webp")
            webp_success = self.optimize_image(
                input_path, webp_path, 'webp', 
                self.quality_settings['webp'], max_size
            )
            
            # Create optimized PNG version as fallback
            png_path = os.path.join(self.input_dir, f"{base_name}_optimized.png")
            png_success = self.optimize_image(
                input_path, png_path, 'png', 
                self.quality_settings['png'], max_size
            )
            
            if webp_success or png_success:
                successful += 1
                total_original += os.path.getsize(input_path)
                if webp_success:
                    total_optimized += os.path.getsize(webp_path)
                if png_success:
                    total_optimized += os.path.getsize(png_path)
            
            print()  # Empty line for readability
        
        print("=" * 50)
        print(f"Optimization complete!")
        print(f"Successfully processed: {successful}/{len(png_files)} files")
        
        if total_original > 0:
            total_reduction = ((total_original - total_optimized) / total_original) * 100
            print(f"Total size reduction: {total_reduction:.1f}%")
            print(f"Original total: {total_original:,} bytes")
            print(f"Optimized total: {total_optimized:,} bytes")

def main():
    parser = argparse.ArgumentParser(description='Optimize images for Dharmapala Shield')
    parser.add_argument('--input-dir', default='assets/images', help='Input directory (default: assets/images)')
    args = parser.parse_args()
    
    optimizer = ImageOptimizer()
    optimizer.input_dir = args.input_dir
    
    print("Dharmapala Shield - Image Optimizer")
    print("=" * 40)
    
    # Check if PIL is available
    try:
        from PIL import Image
        print(f"✓ PIL (Pillow) is available")
    except ImportError:
        print("✗ PIL (Pillow) not found. Install with: pip install Pillow")
        sys.exit(1)
    
    optimizer.process_all_images()

if __name__ == '__main__':
    main()

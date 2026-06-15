# Crops Rob Weston's portrait out of the LinkedIn source screenshot.
# Source: public/images/rob-weston-source.png (LinkedIn profile screenshot)
# Output: public/images/rob-weston.png (4:5 portrait crop centered on face)
#
# Centered on the circular portrait region in the upper-left area of the
# LinkedIn header card. Square crop 220x275 at offset (8, 105) gives a
# clean 4:5 framing that includes head + shoulders without the
# surrounding chrome.

Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\buyss\Manifold Delta\Artifacts\00_shards\public\images\rob-weston-source.png"
$dstPath = "C:\Users\buyss\Manifold Delta\Artifacts\00_shards\public\images\rob-weston.png"

$img = [System.Drawing.Image]::FromFile($srcPath)

# Source crop rectangle (xy in source pixels, width x height).
# Centred on Rob's face (~118, 215) with a 4:5 portrait window tight
# enough to skip the gold cover-image rings at the top and the
# "Rob Weston · 1st" name banner below the circular avatar.
$srcRect = New-Object System.Drawing.Rectangle 38, 132, 158, 198

# Output bitmap at higher resolution for retina-friendly portrait
$scale = 3
$dstW = 158 * $scale
$dstH = 198 * $scale

$bmp = New-Object System.Drawing.Bitmap $dstW, $dstH
$bmp.SetResolution(144.0, 144.0)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$dstRect = New-Object System.Drawing.Rectangle 0, 0, $dstW, $dstH
$g.DrawImage($img, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

$bmp.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
$img.Dispose()

Write-Host "Wrote $dstPath ($dstW x $dstH)"

#Import required image modules
from PIL import Image, ImageFilter

#Import all the enhancement filter from pillow
from PIL.ImageFilter import (
   BLUR, CONTOUR, DETAIL, EDGE_ENHANCE, EDGE_ENHANCE_MORE,
   EMBOSS, FIND_EDGES, SMOOTH, SMOOTH_MORE, SHARPEN
)
#Create image object
img = Image.open('sample_input.png')
#Applying the blur filter
img1 = img.filter(CONTOUR)
img1.save('sample_output.png')
img1.show()
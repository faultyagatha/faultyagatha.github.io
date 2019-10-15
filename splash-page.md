---
layout: splash
permalink: /
header:
  overlay_color: "#000"
  overlay_filter: "0.5"
  overlay_image: /assets/images/layout1.png
  actions:
    - label: "Play"
      url: "https://vimeo.com/faultyagatha"
  caption: "Photo credit: [**@faultyagatha**](https://instagram.com/faultyagatha/)"
excerpt: "Hello there and welcome to my world! I am Faulty Agatha, a visual artist and creative technologist living in Berlin."
intro: 
  - excerpt: 'In my art practice, I merge video, creative coding, and game design to create experimental visual experiences. I enjoy coding and try to code whenever I can, as for example, I do with this website. Below is the short-list of my works. If you like them drop me a line at **faulty.agatha(at)gmail(dot)com.**'
feature_row1:
  - image_path: assets/images/unsplash-gallery-image-1-th.jpg

  #   #alt: "placeholder image 1"
  #   title: "Fantasynth"
  #   excerpt: "Imaginary world built in Unity."
  #   url: "https://github.com/faultyagatha/OrientationProject"
  #   btn_label: "Read More"
  #   btn_class: "btn--primary"
  # - image_path: /assets/images/fantasynth.png
  #   image_caption: #"Photo credit: [**@faultyagatha**](https://instagram.com/faultyagatha/)"

    alt: "placeholder image 2"
    title: "Fantasynth"
    excerpt: "Imaginary world built with Unity."
    url: "https://github.com/faultyagatha/OrientationProject"
    btn_label: "Read More"
    btn_class: "btn--primary"
  - image_path: /assets/images/fantasynth.png
    #title: "Placeholder 3"
    #excerpt: "This is some sample content that goes here with **Markdown** formatting."
# feature_row2:
#   - image_path: /assets/images/unsplash-gallery-image-2-th.jpg
#     alt: "placeholder image 2"
#     title: "Placeholder Image Left Aligned"
#     excerpt: 'This is some sample content that goes here with **Markdown** formatting. Left aligned with `type="left"`'
#     url: "#test-link"
#     btn_label: "Read More"
#     btn_class: "btn--primary"
# feature_row3:
#   - image_path: /assets/images/unsplash-gallery-image-2-th.jpg
#     alt: "placeholder image 2"
#     title: "Placeholder Image Right Aligned"
#     excerpt: 'This is some sample content that goes here with **Markdown** formatting. Right aligned with `type="right"`'
#     url: "#test-link"
#     btn_label: "Read More"
#     btn_class: "btn--primary"
# feature_row4:
#   - image_path: /assets/images/unsplash-gallery-image-2-th.jpg
#     alt: "placeholder image 2"
#     title: "Placeholder Image Center Aligned"
#     excerpt: 'This is some sample content that goes here with **Markdown** formatting. Centered with `type="center"`'
#     url: "#test-link"
#     btn_label: "Read More"
#     btn_class: "btn--primary"
---

{% include feature_row id="intro" type="center" %}

{% include feature_row id="feature_row1" type="left"%}

{% include feature_row id="feature_row2" type="left" %}

{% include feature_row id="feature_row3" type="right" %}

{% include feature_row id="feature_row4" type="center" %}
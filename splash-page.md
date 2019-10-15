---
layout: splash
permalink: /
header:
  overlay_color: "#000"
  overlay_filter: "0.5"
  overlay_image: /assets/images/layout1.png
  actions:
    - label: "Play"
      url: "https://github.com/mmistakes/minimal-mistakes/"
  caption: "Photo credit: [**@faultyagatha**](https://instagram.com/faultyagatha/)"
excerpt: "Hello there and welcome to my world! I am Faulty Agatha, a visual artist and creative technologist living in Berlin."
intro: 
  - excerpt: 'In my art practice, I merge video, creative coding, and game design to create experimental visual experiences. I value equality, respect, and openness to the world and look forward to any kind of collaboration and creative exchange. If you think we could get creative together drop me a line at **faulty.agatha(at)gmail(dot)com.**'
feature_row:
  - image_path: assets/images/unsplash-gallery-image-1-th.jpg
    alt: "Placeholder 1"
    title: "Fantasynth"
    excerpt: "Imaginary world build in Unity."
    url: "#test-link"
    btn_label: "Read More"
    btn_class: "btn--primary"
  - image_path: /assets/images/fantasynth.tif
    image_caption: "Photo credit: [**@faultyagatha**](https://instagram.com/faultyagatha/)"
    alt: "placeholder image 2"
    title: "Placeholder 2"
    excerpt: "This is some sample content that goes here with **Markdown** formatting."
    url: "#test-link"
    btn_label: "Read More"
    btn_class: "btn--primary"
  - image_path: /assets/images/unsplash-gallery-image-3-th.jpg
    title: "Placeholder 3"
    excerpt: "This is some sample content that goes here with **Markdown** formatting."
feature_row2:
  - image_path: /assets/images/unsplash-gallery-image-2-th.jpg
    alt: "placeholder image 2"
    title: "Placeholder Image Left Aligned"
    excerpt: 'This is some sample content that goes here with **Markdown** formatting. Left aligned with `type="left"`'
    url: "#test-link"
    btn_label: "Read More"
    btn_class: "btn--primary"
feature_row3:
  - image_path: /assets/images/unsplash-gallery-image-2-th.jpg
    alt: "placeholder image 2"
    title: "Placeholder Image Right Aligned"
    excerpt: 'This is some sample content that goes here with **Markdown** formatting. Right aligned with `type="right"`'
    url: "#test-link"
    btn_label: "Read More"
    btn_class: "btn--primary"
feature_row4:
  - image_path: /assets/images/unsplash-gallery-image-2-th.jpg
    alt: "placeholder image 2"
    title: "Placeholder Image Center Aligned"
    excerpt: 'This is some sample content that goes here with **Markdown** formatting. Centered with `type="center"`'
    url: "#test-link"
    btn_label: "Read More"
    btn_class: "btn--primary"
---

{% include feature_row id="intro" type="center" %}

{% include feature_row %}

{% include feature_row id="feature_row2" type="left" %}

{% include feature_row id="feature_row3" type="right" %}

{% include feature_row id="feature_row4" type="center" %}
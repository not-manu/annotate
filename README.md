<div align="center">
<h3>Annotate</h3>
<p>Annotate your PDFs with LaTeX & Typst!</p>
</div>

#### Demo

![a demo of annotate in action](./art/demo-video.gif)

### Quick start


```bash
# Install globally
npm i -g @notmanu/annotate

# Start watching homework.pdf for changes (using LaTeX for annotations)
annotate watch homework.pdf --with latex
```

Edit `./homework/pages/page-01.tex` and add a textbox inside the document:

```tex

\textbox[x=10em, y=40em, w=30em, h=10em, border]{
  \large
  Hello Annotate!
}
```

This annotate the first page with some text. You can view the annotated PDF at `./homework/homework-annotate.pdf`! 


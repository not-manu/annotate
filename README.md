<div align="center">
<h3>Annotate</h3>
<p>Annotate your PDFs with LaTeX & Typst!</p>
</div>

<br/>

![a demo of annotate in action](./art/demo-video.gif)

<br/>

<div align="center">

[Quick Start](#quick-start) 
&nbsp;&bull;&nbsp;
[How it works](#how-it-works)


</div>


### Quick start


<div style="display:flex; gap:8px; align-items:stretch;">
<div style="flex:1; display:flex; flex-direction:column;">

```bash
# Install globally
npm i -g @notmanu/annotate

```

</div>
<div style="flex:1; display:flex; flex-direction:column;">

```bash
# Or with pnpm / bun
pnpm add -g @notmanu/annotate
bun add -g @notmanu/annotate
```

</div>
</div>

Start annotating a PDF with the following command:

```bash
annotate homework.pdf -w latex 
```

Edit `./homework/pages/page-01.tex` and add a textbox inside the document:

```tex
\textbox[x=10em, y=40em, w=30em, h=10em, border]{
  \large
  Hello Annotate!
}
```

This annotate the first page with some text. You can view the annotated PDF at `./homework/homework-annotate.pdf`! 


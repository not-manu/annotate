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
[How I use it](#how-i-use-it)
&nbsp;&bull;&nbsp;
[Annotating with AI Agents](#annotating-with-ai-agents)
&nbsp;&bull;&nbsp;
[How it works](#how-it-works)
&nbsp;&bull;&nbsp;
[Contributing](#contributing)

</div>

<br/>
<br/>


### Quick start

**1. Install Annotate**

```sh
# Install globally
npm i -g @notmanu/annotate

# Or with pnpm / bun
pnpm add -g @notmanu/annotate
bun add -g @notmanu/annotate
```

<br />
<br />


<img align="right" src="./art/file-tree.png" alt="file tree showing the generated project structure" width="300">

**2. Start Watching a PDF**

Start annotating a PDF with the following command:

```sh
annotate homework.pdf -w latex 
```

This will create a new folder called `homework` with the structure shown on the right.

<br />
<br />

**3. Add some annotations!**

Edit `page-01.tex` and add a textbox inside the document:

```tex
\textbox[x=10em, y=40em, w=30em, h=10em, border]{
  \large
  Hello Annotate!
}
```

This annotate the first page with some text. The final document `homework-annotated.pdf` will automatically compile as you add annotations.

<br/>
<br/>

### How I use it

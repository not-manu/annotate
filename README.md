<div align="center">
<h2>Annotate</h2>
<p>Annotate your PDFs with LaTeX & Typst!</p>
</div>

<br/>

**Demo**

<img src="./art/demo-video.gif" alt="a demo of annotate in action" width="100%">

<br/>

<img align="right" src="https://placehold.co/1280x720" alt="file tree showing the generated project structure" width="50%">

**How I use it**:

I use Annotate for 90% of my homework at university! In this video I explain how I use it everyday, and how I speed up my workflow with AI agents. 

**Why?** 
- All my professors are strict with how I format my work. (I cannot modify the original PDF and must write over it!)
- I don't want to pay to print out my homework.
- I can easily resubmit changes without needing to print out a new copy.


<br/>
<br/>

<div align="center">

[Quick Start](#quick-start) 
&nbsp;&bull;&nbsp;
[Features](#features)
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

```latex
\textbox[x=10em, y=40em, w=30em, h=10em, border]{
  \large
  Hello Annotate!
}
```

This annotate the first page with some text. The final document `homework-annotated.pdf` will automatically compile as you add annotations.

<br/>
<br/>

### Features

Annotate should work out of the box with your TeX distribution (pdflatex, xelatex, latexmk, tectonic) or with Typst.

<br/>

| Engine | Language | Supported | Tested | Notes |
|--------|----------|-----------|--------|-------|
| **tectonic** | **LaTeX** | **✓** | **✓** | **Recommended, auto-downloads packages** |
| **typst** | **Typst** | **✓** | **✓** | The future of typesetting! |
| latexmk | LaTeX | ✓ | ✓ | Common in TeX distributions |
| pdflatex | LaTeX | ✓ | ✓ | Basic LaTeX engine |
| xelatex | LaTeX | ✓ | ✓ | Unicode/font support |
| lualatex | LaTeX | ✗ | ✗ | Not yet implemented |

<br/>

> **Note:** Engines that are not tested should work but haven't been verified yet. If you try one, please [open an issue](https://github.com/not-manu/annotate/issues) and let me know how it goes! Thank you!

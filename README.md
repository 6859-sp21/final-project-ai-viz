<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About Reading Between the Lines](#about-reading-between-the-lines)
  * [Built With](#built-with)
  * [Interaction](#interaction)
* [Getting Started](#getting-started)
  * [Starting a Simple-HTTP-Server](#starting-a-simple-http-server)
* [License](#license)

## About Reading Between the Lines

Poetry is one of the most subjective and expressive forms of literature. As a verbal art form, it predates written text, often involved with emotions, history, culture, religion, and personal expression. Poetry has been around for thousands of years, yet it always lived in a fluid state of development. Often the best poems are written from the heart, raw, emotional, and to the point. Poem favors brevity, yet the best poems also capture a great amount of detail, making them incredibly powerful to their readers. This makes poetry often difficult to fully understand due to its unique literature structure.
Reading Between the Lines explores ways poetry can be interpreted computationally via NLP analysis, as well as if visualization can be used as a tool to provide insights to help the readers deconstruct the poet’s choice of words behind their creation, or provide a new perspective for the poet on what they have written.

### Built With
The visual aspect of the project is primarily built using the open-source JavaScript library D3.js, which creates custom interactive data visualizations in HTML via primarily SVGs. A few visualizations were driven by additional plug-ins such as the D3-Cloud-Plugin and D3-Force-Labels. Additionally, CSS framework like Bootstrap and Javascript libraries like jQuery was used to assist visual styling.
* [D3](https://d3js.org/)
* [JQuery](https://jquery.com)

`Dataset`
A collection of pre-processed and annotated poetry datasets were used for exploration and visualization purpose in this project. Original sources of the poetry datasets were from The Poetry Foundation website.


### Project Page

https://6859-sp21.github.io/final-project-ai-viz/ProjectPage.html

### Visualisation Page

https://6859-sp21.github.io/final-project-ai-viz/

### Paper

https://6859-sp21.github.io/final-project-ai-viz/final/Paper.pdf

### Video

https://www.youtube.com/watch?v=5pDhj6ZcJcI

### Interaction

`Workflow`
Presented in a vertical layout, Reading Between the Lines walks through the ways poetry has developed through the centuries, how emotions are expressed through poetic diction and how the NRC-VAD Lexicon can be used to extract valence, arousal, and dominance scores for poems. It visualizes different sentiment patterns under different contexts such as time periods and categories, as well as the expression of emotions in individual poems. The user can explore a full database of poetry via different interactions, and even create a downloadable visual analysis for a poem of their creation. 

## Getting Started

The visualization should accessible via Github page `https://6859-sp21.github.io/final-project-ai-viz/index.html` To get a local copy up and running is simple and does not require any additional installation. You can use any text-editor / IDE (e.g. Brackets, Webstorm, etc.) or start a simple HTTP Server locally.

### Starting a Simple HTTP Server

1. Clone the repo and save it in a local folder
2. Open terminal and change the directory to the folder of the visualization by typing cd then the file path, or drag the folder into the terminal.
```sh
cd /path/to/folder
```
3. Set up a simple HTTP server using python: If you are using Linux or macOS, it should be available on your system already, and just enter the following in the terminal. If you are a Windows user, you can get an installer from the [Python homepage](https://python.org) and follow the instructions to install python and follow the instruction.
```sh
python3 -m http.server 8000
```
4. You can go to individual visualizations by going to the URL `localhost:8000/cluster.html` or `localhost:8000/bubble.html` in your web browser. 

## Reference
Greene, E., Bodrumlu, T. and Knight, K., 2010, October. Automatic analysis of rhythmic poetry with applications to generation and translation. In Proceedings of the 2010 conference on empirical methods in natural language processing (pp. 524-533).<br>
Hühn, P. and Kiefer, J., 2011. The narratological analysis of lyric poetry: studies in English poetry from the 16th to the 20th century (Vol. 7). Walter de Gruyter.<br>
Kumar, V. and Minz, S., 2014. Multi-view ensemble learning for poem data classification using SentiWordNet. In Advanced Computing, Networking and Informatics-Volume 1 (pp. 57-66). Springer, Cham.<br>
Lau, J.H., Cohn, T., Baldwin, T., Brooke, J. and Hammond, A., 2018. Deep-speare: A joint neural model of poetic language, meter and rhyme. arXiv preprint arXiv:1807.03491.<br>
Madnani, N., 2005. Emily: A tool for visual poetry analysis. University of Maryland, Tech. Rep.<br>
Peters, M.E., Neumann, M., Iyyer, M., Gardner, M., Clark, C., Lee, K. and Zettlemoyer, L., 2018. Deep contextualized word representations. arXiv preprint arXiv:1802.05365.<br>
Singhi, A. and Brown, D.G., 2014. Are poetry and lyrics all that different?. In ISMIR (pp. 471-476).<br>

<!-- LICENSE -->
## License
Distributed under the MIT License. See `LICENSE` for more information.


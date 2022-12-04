const template = document.createElement('template');


template.innerHTML = `
<style>
@font-face {
    font-family: "StatsFont";
    src: url("https://github.com/flavioribeiro/clappr-p2phls-stats-plugin/blob/master/public/visitor.ttf?raw=true");
    src: url("https://github.com/flavioribeiro/clappr-p2phls-stats-plugin/blob/master/public/visitor.ttf?raw=true") format("truetype"),
}

div {
    font-family: "StatsFont";
    position: absolute;
    text-align: left;
    top: 20px;
    left: 20px;
    font-smooth: never;
    -webkit-font-smoothing : none;
    background-color: rgba(0,0,0,0.7);
    color: rgb(255,255,255);
    border-radius: 3px;
    width: 150px;
    height: 200px;
    padding-top: 10px;
    font-size: 12px;
    padding-left: 5px;
}
</style>
`;

class Stats {
    constructor(shadowRoot) {
        console.log("stats ", shadowRoot)
        shadowRoot.appendChild(template.content.cloneNode(true));
        this.box = document.createElement("div")
    }

    add(text) {
        if (!this.box.innerText.includes(text)) {
            this.box.insertAdjacentHTML('beforeend', "<span>" + text + "</span><br>")
        }
    }

    render() {
        return this.box;
    }
}

export default Stats;
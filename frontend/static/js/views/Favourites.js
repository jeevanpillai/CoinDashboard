import AbstractView from "./AbstractView.js";

export default class extends AbstractView{
    constructor(params) {
        super(params);
        this.setTitle("Favourites")
    }

    async getHtml() {

        var title = document.createDocumentFragment();
        document.getElementById("title").innerHTML = "";
        var h1 = document.createElement("h1");
        h1.appendChild(document.createTextNode("Favourites"))
        title.appendChild(h1);
        document.getElementById("title").appendChild(title);

        var tree = document.createDocumentFragment();
        var par = document.createElement("p");
        par.appendChild(document.createTextNode("You are viewing the Favourites!"))
        tree.appendChild(par);
        document.getElementById("app").innerHTML = "";
        document.getElementById("app").appendChild(tree);
        return;
    }
}
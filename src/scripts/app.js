"use strict";

(function(app){
    app.portfolioItems = [];
    app.selectedItem = {};

    app.homePage = async function(){
        setCopyrightDate();
        await loadPageData();
        wireContactForm();
        loadNavMenu();
    };

    app.portfolio = async function(){
        setCopyrightDate();
        await loadPageData();
        updatePortfolioPage();
        loadNavMenu();
    };

    app.workItem = async function(){
        setCopyrightDate();
        await loadPageData();
        loadSpecificItem();
        updateItemPage();
        loadNavMenu();
    };

    function setCopyrightDate(){
        const date = new Date();
        var e = document.getElementById('copyrightYear');
        e.innerText = date.getFullYear();
    }

    function wireContactForm(){
        var e = document.getElementById('contact-form');
        e.onsubmit = contactFormSubmit;
    }

    function contactFormSubmit(e){
        e.preventDefault();
        const form = document.getElementById('contact-form');
        const name = form.querySelector("#name");
        const email = form.querySelector("#email");
        const message = form.querySelector("#message");

        const mailTo = `mailto:${email.value}?subject=Contact From ${name.value}&body=${message.value}`
        window.open(mailTo);

        name.value = '';
        email.value = '';
        message.value = '';
    }

    async function loadPageData(){
        const cacheData = sessionStorage.getItem('site-data');

        if(cacheData !== null){
            app.portfolioItems = JSON.parse(cacheData);
        } else{
            const rawData = await fetch('sitedata.json')
            const data = await rawData.json();
            app.portfolioItems = data;
            sessionStorage.setItem('site-data', JSON.stringify(data));
        }
    }

    function loadSpecificItem(){
        const params = new URLSearchParams(window.location.search);
        let par = params.get('item');
        let item = Number.parseInt(par);

        if(item > app.portfolioItems.length || item < 1){
            item = 1;
        }

        app.selectedItem = app.portfolioItems[item - 1];
        app.selectedItem.id = item;
    }

    function updateItemPage(){
        const header = document.getElementById('work-item-header');
        const image = document.getElementById('work-item-image');
        const projectText = document.querySelector('#project-text p');
        const techSection = document.getElementById('technologies-text');
        const initProjectTech = document.querySelector('#technologies-text ul');
        const projectCha = document.querySelector('#challenges-text p');

        header.innerText = `0${app.selectedItem.id}. ${app.selectedItem.title}`
        image.src = app.selectedItem.largeImage;
        image.alt = app.selectedItem.largeImageAlt;
        projectText.innerText = app.selectedItem.projectText;
        projectCha.innerText = app.selectedItem.challengesText;

        const finalProjectTech = document.createElement("ul");
        for (let i = 0; i < app.selectedItem.technologies.length; i++) {
            const item = document.createElement("li");
            item.innerText = app.selectedItem.technologies[i];
            finalProjectTech.appendChild(item);
        }

        initProjectTech.remove();
        techSection.appendChild(finalProjectTech);
    }

    function updatePortfolioPage(){
        const initItems = document.querySelectorAll('.highlight');      
        const main = document.querySelector("main"); 

        for (let i = 0; i < app.portfolioItems.length; i++) {
            const workItem = document.createElement("div");
            const text = document.createElement("div");
            const img = document.createElement("img");
            const header = document.createElement("h2");
            const anchor = document.createElement("a");
    
            const title = app.portfolioItems[i].title.split(' ');
            header.innerText = `0${i+1}. `;

            title.forEach(e => {
                const brk = document.createElement('br')
                header.innerHTML += e;
                header.appendChild(brk);
            });

            anchor.href = `workitem.html?item=${i+1}`;
            anchor.innerText = 'see more';
            img.src = app.portfolioItems[i].smallImage;
            img.alt = app.portfolioItems[i].smallImageAlt;

            text.appendChild(header);
            text.appendChild(anchor);
            workItem.appendChild(text);
            workItem.appendChild(img);
            workItem.classList.add('highlight');

            if( i % 2 > 0){
                workItem.classList.add('inverted');
            }

            main.appendChild(workItem);
        }

        initItems.forEach(e => {
            e.remove();
        });
    }

    function loadNavMenu(){
        const initItems = document.querySelectorAll('.work-item-nav');
        const navList = document.querySelector('nav ul');
        let newItems = [];

        for (let i = 0; i < app.portfolioItems.length; i++) {
            const item = document.createElement("li");
            const anchor = document.createElement("a");

            anchor.href = `workitem.html?item=${i + 1}`;
            anchor.innerText = `Item #${i + 1}`;
            item.classList.add('work-item-nav');
            item.appendChild(anchor);
            
            newItems.push(item);
        }

        initItems.forEach(e => {
            e.remove();
        });

        newItems.forEach(e => {
            navList.appendChild(e);
        });
    }
})(window.app = window.app || {})

    /* ======= Model ======= */

    var model = {
        isAdmin: false,
        currentCat: null,
        cats: [{
            clickCount: 0,
            name: 'Tabby',
            imgSrc: 'img/434164568_fea0ad4013_z.jpg',
            imgAttribution: 'https://www.flickr.com/photos/bigtallguy/434164568'
        }, {
            clickCount: 0,
            name: 'Tiger',
            imgSrc: 'img/4154543904_6e2428c421_z.jpg',
            imgAttribution: 'https://www.flickr.com/photos/xshamx/4154543904'
        }, {
            clickCount: 0,
            name: 'Scaredy',
            imgSrc: 'img/22252709_010df3379e_z.jpg',
            imgAttribution: 'https://www.flickr.com/photos/kpjas/22252709'
        }, {
            clickCount: 0,
            name: 'Shadow',
            imgSrc: 'img/1413379559_412a540d29_z.jpg',
            imgAttribution: 'https://www.flickr.com/photos/malfet/1413379559'
        }, {
            clickCount: 0,
            name: 'Sleepy',
            imgSrc: 'img/9648464288_2516b35537_z.jpg',
            imgAttribution: 'https://www.flickr.com/photos/onesharp/9648464288'
        }]
    };


    /* ======= Octopus ======= */

    var octopus = {

        init: function() {
            // set our current cat to the first one in the list
            model.currentCat = model.cats[0];

            // tell our views to initialize
            catListView.init();
            catView.init();
            adminView.init();
        },

        getCurrentCat: function() {
            return model.currentCat;
        },

        getCats: function() {
            return model.cats;
        },

        // set the currently-selected cat to the object passed in
        setCurrentCat: function(cat) {
            model.currentCat = cat;
        },

        // increments the counter for the currently-selected cat
        incrementCounter: function() {
            model.currentCat.clickCount++;
            catView.render();
            adminView.updateFormCount();
        },

        getAdminState: function() {
            return model.isAdmin;
        },

        setAdminState: function(state) {
            model.isAdmin = state;
            adminView.render();
        },

        updateCat: function(changedCat) {
            var currCat = this.getCurrentCat();
            currCat.name = changedCat.name;
            currCat.imgSrc = changedCat.url;
            currCat.clickCount = changedCat.clicks;
            this.setAdminState(false);
            catListView.render();
            catView.render();
            adminView.render();
        }
    };


    /* ======= View ======= */

    var catView = {

        init: function() {
            // store pointers to our DOM elements for easy access later
            this.catElem = document.getElementById('cat');
            this.catNameElem = document.getElementById('cat-name');
            this.catImageElem = document.getElementById('cat-img');
            this.countElem = document.getElementById('cat-count');

            // on click, increment the current cat's counter
            this.catImageElem.addEventListener('click', function() {
                octopus.incrementCounter();
            });

            // render this view (update the DOM elements with the right values)
            this.render();
        },

        render: function() {
            // update the DOM elements with values from the current cat
            var currentCat = octopus.getCurrentCat();
            this.countElem.textContent = currentCat.clickCount;
            this.catNameElem.textContent = currentCat.name;
            this.catImageElem.src = currentCat.imgSrc;
        }
    };

    var catListView = {

        init: function() {
            // store the DOM element for easy access later
            this.catListElem = document.getElementById('cat-list');

            // render this view (update the DOM elements with the right values)
            this.render();
        },

        render: function() {
            var cat, elem, i;
            // get the cats we'll be rendering from the octopus
            var cats = octopus.getCats();

            // empty the cat list
            this.catListElem.innerHTML = '';

            // loop over the cats
            for (i = 0; i < cats.length; i++) {
                // this is the cat we're currently looping over
                cat = cats[i];

                // make a new cat list item and set its text
                elem = document.createElement('li');
                elem.textContent = cat.name;

                // on click, setCurrentCat and render the catView
                // (this uses our closure-in-a-loop trick to connect the value
                //  of the cat variable to the click event function)
                elem.addEventListener('click', (function(catCopy) {
                    return function() {
                        octopus.setCurrentCat(catCopy);
                        catView.render();
                        adminView.render();
                    };
                })(cat));

                // finally, add the element to the list
                this.catListElem.appendChild(elem);
            }
        }
    };

    var adminView = {
        init: function() {
            this.adminBtn = document.getElementById('admin-btn');
            this.cancelBtn = document.getElementById('cancel-btn');
            this.saveBtn = document.getElementById('save-btn');
            this.catForm = document.getElementById('cat-form');
            this.formName = document.getElementsByName('form-name')[0];
            this.formUrl = document.getElementsByName('form-url')[0];
            this.formClicks = document.getElementsByName('form-clicks')[0];

            this.adminBtn.addEventListener('click', function(event) {
                var isAdmin = octopus.getAdminState();
                if (!isAdmin) {
                    octopus.setAdminState(true);
                }
            });

            this.cancelBtn.addEventListener('click', function() {
                octopus.setAdminState(false);
            });

            this.saveBtn.addEventListener('click', function() {
                octopus.updateCat({
                    name: adminView.formName.value,
                    url: adminView.formUrl.value,
                    clicks: adminView.formClicks.value
                });
            });
        },

        render: function() {
            var isAdmin = octopus.getAdminState();
            if (isAdmin) {
                this.catForm.classList.remove('hidden');
                var currCat = octopus.getCurrentCat();
                this.formName.value = currCat.name;
                this.formUrl.value = currCat.imgSrc;
                this.formClicks.value = currCat.clickCount;
            } else {
                this.catForm.classList.add('hidden');
            }
        },

        updateFormCount: function() {
            this.formClicks.value = octopus.getCurrentCat().clickCount;
        }
    }

    // make it go!
    octopus.init();

import {postsDB} from './services/postsDB.js';
import {mediator} from './services/mediator.js';
import {ViewAuthorsPage} from "./authorsPage/viewAuthorsPage.js";


document.addEventListener('DOMContentLoaded', () => {
	new ViewAuthorsPage(postsDB, mediator);
})

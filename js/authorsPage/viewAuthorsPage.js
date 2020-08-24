export class ViewAuthorsPage{
	constructor(postsDB, mediator) {
		this.postsDB = postsDB;
		this.mediator = mediator;
		this.authorListHorizontal = document.querySelector('.row--author-list');
		this.authorListVertical = document.querySelector('.author-list--aside');
		this.postsListHorizontal = document.querySelector('.row--post-list');
		this.postText = document.querySelector('.post-text');

		this.renderAuthorsListHorizontal();
		this.renderAuthorsListVertical();

		this.subscribers();
	}

	// R E N D E R     E L E M E N T S

	renderAuthorBtn(name){
		let btn = document.createElement('button');
		btn.classList.add('btn', 'btn--author-light');
		btn.innerText = name;
		btn.addEventListener('click', ev => {
			this.mediator.publish('clickAuthor', ev);  // broadcast
		});
		return btn;
	}

	renderAuthorsListHorizontal (){
		for(let i =0; i<this.postsDB.length; i++){
			this.authorListHorizontal.append(this.renderAuthorBtn(this.postsDB[i].author));
		}
	}

	renderAuthorsListVertical(){
		for(let i =0; i<this.postsDB.length; i++){
			let div = document.createElement('div');
			div.classList.add('author-list--block');
			div.append(this.renderAuthorBtn(this.postsDB[i].author));
			this.authorListVertical.append(div);
		}
	}

	renderAuthorImg(link){
		return `<img src="${link}" alt="author img" width="50">`;
	}

	renderPostTitleItem(title){
		let li = document.createElement('li');
		let a = document.createElement('a');
		a.classList.add('post-link');
		a.href = '#';
		a.innerText = title;
		a.addEventListener('click', ev => {
			this.mediator.publish('clickPost', ev); // broadcast
		})
		li.append(a);
		return li;
	}

	renderPostList(authorObj, direction = 'horizontal'){
		let ul = document.createElement('ul');
		if(direction === 'horizontal'){
			ul.classList.add('post-list', 'post-list--horizontal');
		} else {
			ul.classList.add('post-list', 'post-list--vertical');
		}		
		for(let i=0; i<authorObj.posts.length; i++){
			ul.append(this.renderPostTitleItem(authorObj.posts[i].title))
		}
		return ul;
	}

	findVerticalBlock(name){
		let blocks = [...document.querySelectorAll('.author-list--block')];
		return blocks.find(block => block.textContent == name);
	}

	findAuthor(name){
		return this.postsDB.find(authorObj => authorObj.author == name);
	}

	clearVerticalPostList(){
		let ul = document.querySelector('.post-list--vertical');
		if(ul) ul.parentNode.removeChild(ul);
	}

	renderHorizontalPosts(ev){
		let authorObj = this.findAuthor(ev.target.innerText);
		this.postsListHorizontal.innerHTML = this.renderAuthorImg(authorObj.authorImg);
		this.postsListHorizontal.append(this.renderPostList(authorObj));
	}

	renderVerticalPosts(ev){
		let authorObj = this.findAuthor(ev.target.innerText);
		let parentDiv = this.findVerticalBlock(ev.target.innerText);
		this.clearVerticalPostList();
		parentDiv.append(this.renderPostList(authorObj, 'vertical'));
	}

	changeBtnColor(ev){
		let name = ev.target.innerText;
		let btns = [...document.querySelectorAll('.btn')];
		btns.forEach( btn => {
			if(btn.classList.contains('btn--author-dark'))	btn.classList.remove('btn--author-dark');
			if(btn.textContent == name) btn.classList.add('btn--author-dark');
		});
	}

	clearPostText(){
		this.postText.innerHTML = '';
	}

	renderPostText(post){
		this.postText.innerHTML = `
			<p class="post-text--title">${post.title}</p>
			<p class="post-text--description">${post.text}</p>
		`
	}

	findPost(name, title){
		let authorObj = this.findAuthor(name)
		return authorObj.posts.find(post => post.title == title);
	}

	renderPost(ev){
		let authorName = document.querySelector('.btn--author-dark').innerText;
		let title = ev.target.innerText;
		let post = this.findPost(authorName, title);
		this.renderPostText(post);
	}

	changePostTitleColor(ev){
		let title = ev.target.innerText;
		let postLinks = [... document.querySelectorAll('.post-link')];
		postLinks.forEach(link => {
			if(link.classList.contains('choice')) link.classList.remove('choice');
			if(link.textContent == title) link.classList.add('choice');
		})
	}

	// S U B S C R I B E

	subscribers(){
		this.mediator.subscribe('clickAuthor', this.renderHorizontalPosts.bind(this));
		this.mediator.subscribe('clickAuthor', this.renderVerticalPosts.bind(this));
		this.mediator.subscribe('clickAuthor', this.changeBtnColor.bind(this));
		this.mediator.subscribe('clickAuthor', this.clearPostText.bind(this));

		this.mediator.subscribe('clickPost', this.renderPost.bind(this));
		this.mediator.subscribe('clickPost', this.changePostTitleColor.bind(this));
	}
}
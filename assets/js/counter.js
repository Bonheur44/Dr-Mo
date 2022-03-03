let copy = document.querySelector('#copy')
let paste = document.querySelector('#paste')
let text = document.querySelector('#text')
let p = document.querySelector('#words')
let lauchCount = document.querySelector('#lauchCount')

let regexp = /[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ-]/

/**Copier dans le presse-papiers */
copy.addEventListener('click', function (e) {
	e.preventDefault()
	if (text.value.length) {
		navigator.clipboard.writeText(text.value).then(() => {
			copy.innerHTML = `<i class="bi bi-check-circle"></i> Copié`
			setTimeout(function () {
				copy.innerHTML = `<i class="bi bi-files"></i> Copier`
			}, 2000)
		})
	} else {
		alert("Veuillez saisir le texte à copier")
	}
})

/**Coller depuis le presse-papiers */
paste.addEventListener('click', function (e) {
	e.preventDefault()
	navigator.clipboard.readText().then((texte) => {
		text.value = texte
	})
})

/**Démarrer le comptage des mots */
lauchCount.addEventListener('click', function (e) {
	e.preventDefault()
	show(count(text.value))
})

let count = (text) => {
	if (text.length == 0) return 0
	if (text.length == 1 && text[0] == '-') return 0

	//Remplacer les adresses email par un mot chacune
	text = text.replace(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/g, 'a')

	//Remplacer les nombres décimaux par un mot chacun
	text = text.replace(/\D+[-]?\d+,\d+/g, 'a,b')
	text = text.replace(/[-]?\d+,\d+/g, 'a')

	//Remplacer les balises HTML par un mot chacune
	text = text.replace(/<[/]?[a-zA-Z]+>/g, '/')

	//Ne pas considérer les tirets s'ils ne se trouvent pas dans des mots
	text = text.replace(/(?<=[^a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ])-/g, '/')
	text = text.replace(/-(?=[^a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ])/g, '/')

	let i = 0, nbrMots = 0, mot = '', l = text.length
	
	do {
		if (regexp.test(text[i])) {
			while (i < l && regexp.test(text[i])) {
				
				mot += text[i]
				i++
			}
			nbrMots++
		}

		i++
	} while (i < l)
	return nbrMots
}

function show(num) {
	if (num == 1) p.innerHTML = `Il y a ${num} mot`
	else p.innerHTML = `Il y a ${num} mots`
}
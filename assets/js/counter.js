let byFile = document.querySelector('#byFile')
let byField = document.querySelector('#byField')
let text = document.querySelector('#text')
let file = document.querySelector('#file')
let p = document.querySelector('#words')
let lauchCount = document.querySelector('#lauchCount')

let regexp = /[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ-]/

byField.addEventListener('change', function () {
    file.setAttribute('disabled', 'disabled')
    if (text.getAttribute('disabled') === 'disabled') text.removeAttribute('disabled')
})

byFile.addEventListener('change', function () {
    text.setAttribute('disabled', 'disabled')
    if (file.getAttribute('disabled') === 'disabled') file.removeAttribute('disabled')
})

file.addEventListener('change', function (event) {
	const fileList = event.target.files
	if (fileList[0].type !== 'text/plain') {
		alert('Le fichier que vous avez sélectionné n\'est pas un fichier txt')
		lauchCount.setAttribute('disabled', 'disabled')
	} else lauchCount.removeAttribute('disabled')
})

lauchCount.addEventListener('click', function (e) {
	e.preventDefault()
	if (text.getAttribute('disabled') !== 'disabled') show(count(text.value))
	else if (file.getAttribute('disabled') !== 'disabled') loadFile(file.files[0])
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

async function loadFile(file) {
	show(count(await file.text()))
}

function show(num) {
	if (num == 1) p.innerHTML = `Il y a ${num} mot`
	else p.innerHTML = `Il y a ${num} mots`
}
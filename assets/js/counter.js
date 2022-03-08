let text = document.querySelector('#text')
let modif = document.querySelector('#modif')
let p = document.querySelector('#words')
let gram = undefined, obj = undefined
let tab = [], links = [], co = undefined
let suggest = undefined
let up = document.querySelector('#toUp')
let down = document.querySelector('#toDown')
let modalBody = document.querySelector('.modal-body')
let result = document.querySelector('.result')
let validate = document.querySelector('#validate')

let regexp = /[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ-]/

/**Copier dans le presse-papiers */
document.querySelector('#copy').addEventListener('click', function (e) {
	e.preventDefault()
	if (text.value.length) {
		navigator.clipboard.writeText(text.value).then(() => {
			this.innerHTML = `<i class="bi bi-check-circle"></i> Copié`
			setTimeout(function () {
				document.querySelector('#copy').innerHTML = `<i class="bi bi-files"></i> Copier`
			}, 2000)
		}).catch(function () {alert('Texte non copié! Réessayez!')})
	} else {
		alert("Veuillez saisir le texte à copier")
	}
})

/**Coller depuis le presse-papiers */
document.querySelector('#paste').addEventListener('click', function (e) {
	e.preventDefault()
	navigator.clipboard.readText().then((texte) => {
		text.value = texte
	}).catch(function () {})
})

/**Valider le contenu du div modifié */
validate.addEventListener('click', function (e) {
	e.preventDefault()
	text.value = modif.textContent
	text.removeAttribute('readonly')
	result	.style.display = 'none'
})

/**Défiler vers le haut */
up.addEventListener('click', function (e) {
	e.preventDefault()
	co = links.indexOf(up.getAttribute('href'))
	co -= 1
	if (co >= 0) {
		up.setAttribute('href', links[co])
		down.setAttribute('href', links[co])
		document.location.href = links[co]
	}
})

/**Défiler vers le bas */
down.addEventListener('click', function (e) {
	e.preventDefault()
	co = links.indexOf(down.getAttribute('href'))
	co += 1
	if (co < links.length) {
		down.setAttribute('href', links[co])
		up.setAttribute('href', links[co])
		document.location.href = links[co]
	}
})

/**Démarrer le comptage des mots */
document.querySelector('#lauchCount').addEventListener('click', function (e) {
	e.preventDefault()
	show(count(text.value))
})

text.addEventListener('click', function () {
	if (modif.style.display == 'block') {
		alert('Validez d\'abord le contenu du deuxième bloc')
	}
})

/**Lanceur d'analyse */
document.querySelector('#analyze').addEventListener('click', function (e) {
	e.preventDefault()
	modif.innerHTML = ''
	result.style.display = 'block'
	text.setAttribute('readonly', 'readonly')
	fetch('https://api.textgears.com/grammar?key=wyaPWaqVZdy55zOY&text='+ text.value.replace(/\n/g, ` `) +'&language=fr-FR')
	.then(function (data) {
		return data.json()
	}).then(function (res) {
		if (res.error_code) {
			switch (res.error_code) {
				case 606 :
					alert('Langue non supportée!')
					break
				case 607 :
					alert('Nombre de requêtes journalier dépassé! Réessayez dans 24h!')
					break
				case 500 :
					alert('Erreur de service interne inconnu!')
					break
				case 501 :
					alert('La longueur du texte dépasse la limite de débit!')
					break
				default :
					break
			}
		} else {
			if (res.response.errors) {
				up.setAttribute('href', '#span0')
				down.setAttribute('href', '#span0')
				for (let i of res.response.errors) {
					tab.push(i.offset)
				}
				let i = 0, n = 0
				while (i < text.value.length) {
					let j = tab.indexOf(i)
					if (j !== -1) {
						obj = res.response.errors[j]
						modif.textContent += `<span id="span${n}" class="grammar-error" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal">${obj.bad}</span>`
						links.push(`#span${n}`)
						n++
						i += obj.length
					} else {
						modif.textContent += text.value[i]
						i++
					}
				}
				tab = []
				modif.innerHTML = modif.textContent
				gram = document.querySelectorAll('.grammar-error')
				gram.forEach(e => {
					e.style.backgroundColor = 'rgb(119, 25, 25)'
					e.style.color = '#fff'
					e.style.padding = '1px 1px'
					e.style.cursor = 'pointer'
				})
				gram.forEach(e => {
					e.addEventListener('click', function () {
						for (let k of res.response.errors) {
							if (k.bad == e.textContent) {
								obj = k
								break
							}
						}
						document.querySelector('.modal-title').innerHTML = obj.description.en
						modalBody.innerHTML = ''
						modalBody.textContent += `Suggestions : <span value="${e.getAttribute('id')}" data-bs-dismiss="modal" class="suggest">${obj.better[0]}</span>`
						for (let l = 1; l < obj.better.length; l++) {
							modalBody.textContent += ` ,<span value="${e.getAttribute('id')}" data-bs-dismiss="modal" class="suggest">${obj.better[l]}</span>`
						}
						modalBody.innerHTML = modalBody.textContent
						suggest = document.querySelectorAll('.suggest')
						suggest.forEach(f => {
							f.addEventListener('click', function () {
								let span = document.querySelector(`#${f.getAttribute('value')}`)
								span.innerHTML = f.textContent
							})
							f.style.fontStyle = 'italic'
							f.style.cursor = 'pointer'
						})
					})
				})
			}
		}
	})
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

function show (num) {
	if (num == 1) p.innerHTML = `Il y a ${num} mot`
	else p.innerHTML = `Il y a ${num} mots`
}
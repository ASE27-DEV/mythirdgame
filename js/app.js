const canvas = document.querySelector('canvas'); // Je lie ma const canvas à mon canvas en html
const ctx = canvas.getContext('2d'); // Ici je donne le context de mon canvas (2d), et cela permet aussi d'appeler cette variable 

// Taile de mon canvas
canvas.width = innerWidth; // J'impose à mon canvas de faire la largeur de ma page html
canvas.height = innerHeight; // J'impose à mon canvas de faire la hauteur de ma page html

// Je pointe tout les élements HTML du même nom pour faire la liaison
const scoreElement = document.querySelector('#scoreElement')
// const btn_start_game = document.querySelector('#btn_start_game')
const modal_gameUi = document.querySelector('#modal_gameUi')
const scorePoints = document.querySelector('#scorePoints')
const bestScore = document.querySelector('#bestScore') 


// 1 - Creer un Joueur 
class Player { // Je cree une classe Player
    constructor(x, y, radius, color) { // Ici les spécificités qui seront données à chaque fois que je crée un joueur
        this.x = x,
        this.y = y,
        this.radius = radius,
        this.color = color
    }

    dessine() { // Je crée la fonction pour dessiner mon joueur à l'écran
        ctx.beginPath(), // Fonction obligatoire
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false), // Ici les parametres sont pointés par this et mis entre parenthése quand je crée mon joueur
        ctx.fillStyle = this.color, // Fonction pour choisir la couleur à l'intérieur de mon joueur
        ctx.fill() // Fonction obligatoire pour remplir le rond de la couleur sélectionné au dessus
    }
}

// 2 - Tirs de projectiles
class Projectile {
    constructor(x, y, radius, color, velocity) { // Les 4 paramètres de mon constructor
        this.x = x,
        this.y = y,
        this.radius = radius,
        this.color = color,
        this.velocity = velocity
    };

    dessine() { // Je crée la fonction pour dessiner mon projectile à l'écran
        ctx.beginPath(), // Fonction obligatoire
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false), // Ici les parametres sont pointés par this et mis entre parenthése quand je crée mon projectile. Cette fonction sert a dessiner un rond
        ctx.fillStyle = this.color, // Fonction pour choisir la couleur à l'intérieur de mon projectile
        ctx.fill() // Fonction obligatoire pour remplir le rond de la couleur sélectionné au dessus
    };

    update() { // J'utilise cette fonction pour ajouter du mouvement à mes projectiles
        this.dessine(),
        this.x = this.x + this.velocity.x, // Je donne une vélocité x à mon projectile. 
        this.y = this.y + this.velocity.y // Je donne une vélocité y à mon projectile. 
    };
};

// 3 - Ennemis
class Ennemi {
    constructor(x, y, radius, color, velocity) { // Les 4 paramètres de mon constructor
        this.x = x,
        this.y = y,
        this.radius = radius,
        this.color = color,
        this.velocity = velocity
    };

    dessine() { // Je crée la fonction pour dessiner mon projectile à l'écran
        ctx.beginPath(), // Fonction obligatoire
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false), // Ici les parametres sont pointés par this et mis entre parenthése quand je crée mon projectile. Cette fonction sert a dessiner un rond
        ctx.fillStyle = this.color, // Fonction pour choisir la couleur à l'intérieur de mon projectile
        ctx.fill() // Fonction obligatoire pour remplir le rond de la couleur sélectionné au dessus
    };

    update() { // J'utilise cette fonction pour ajouter du mouvement à mes projectiles
        this.dessine(),
        this.x = this.x + this.velocity.x, // Je donne une vélocité x à mon projectile. 
        this.y = this.y + this.velocity.y // Je donne une vélocité y à mon projectile. 
    };
}

const friction = 0.98 // Variable servant à ralentir la vélocité des particules progressivement
// 3 - Particules pour les explosions
class Particule {
    constructor(x, y, radius, color, velocity) { // Les 4 paramètres de mon constructor
        this.x = x,
        this.y = y,
        this.radius = radius,
        this.color = color,
        this.velocity = velocity
        this.alpha = 1 // Cette variable me permettra d'appliquer un effet fade sur les particules pour qu'elles donnent l'impression de s'effacer
    };

    dessine() { // Je crée la fonction pour dessiner mon projectile à l'écran
        ctx.save() // Fonction obligatoire couplé avec restore() pour éviter l'effet de scintillement quand un ennemi disparait
        ctx.globalAlpha = this.alpha
        ctx.beginPath(), // Fonction obligatoire
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false), // Ici les parametres sont pointés par this et mis entre parenthése quand je crée mon projectile. Cette fonction sert a dessiner un rond
        ctx.fillStyle = this.color, // Fonction pour choisir la couleur à l'intérieur de mon projectile
        ctx.fill() // Fonction obligatoire pour remplir le rond de la couleur sélectionné au dessus
        ctx.restore() // Fonction obligatoire
    };

    update() { // J'utilise cette fonction pour ajouter du mouvement à mes projectiles
        this.dessine(),
        this.velocity.x *= friction // J'ajoute un effet de friction à l'axe x pour qu'il ralentisse au fur et a mesure
        this.velocity.y *= friction // J'ajoute un effet de friction à l'axe y pour qu'il ralentisse au fur et a mesure
        this.x = this.x + this.velocity.x, // Je donne une vélocité x à mon particules. 
        this.y = this.y + this.velocity.y // Je donne une vélocité y à mon particules. 
        this.alpha -= 0.01 // Je provoque un effet fondu/fade sur mes particules
    };
}

// Je crée une constante x et y pour les valeurs des paramétres dans new Player entre parenthése 
const x = canvas.width / 2; // Je place le joueur au milieu de l'axe X de mon canvas
const y = canvas.height / 2; // Je place le joueur au milieu de l'axe y de mon canvas
// Je crée un nouveau joueur
let player = new Player(x, y, 15, 'white');
// J'affiche le nouveau joueur dans mon canvas
// player.dessine(); // je met cette fonction en commentaire car j'ai besoin de la rappeler dans ma fonction animate plus bas

// Je crée un tableau pour contenir et agir sur l'ensemble de mes projectiles
let aProjectiles = [];
// Je crée un tableau pour contenir et agir sur l'ensemble de mes ennemis
let aEnnemis = [];
// Je crée un tableau pour contenir et agir sur l'ensemble de mes particules
let aParticules = [];
// Je crée une variable pour que mon meilleur score soit toujours affiché à l'écran
let checkBestScore = 0;

function initialisation() {
    player = new Player(x, y, 15, 'white');
    aProjectiles = []
    aEnnemis = []
    aParticules = []
    score = 0
    scoreElement.innerHTML = score
    scorePoints.innerHTML = score
};

// Je crée une fonction pour faire apparaitre des ennemis
function spawnEnnemis() {
    setInterval(() => { // J'appelle cette fonction statique pour régler une intervalle entre chaque apparition d'ennemis
        const radius = Math.random() * (30 - 5) + 5 // Je régle le random pour que sa valeur ne puisse pas être en dessous de 5 mais bien entre 5 et 30
        let x
        let y

        // Spawn aléatoire des ennemis en dehors de l'écran
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius // J'utilise un ternaire pour le spawn random de mes ennemis sur l'axe X uniquement en dehors de l'écran
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius // J'utilise un ternaire pour le spawn random de mes ennemis sur l'axe Y uniquement en dehors de l'écran
        }

        // Colorisation aléatoire des ennemis
        const color = `hsl(${Math.random() * 360}, 50%, 50%)` // J'envoi de maniere dynamique la couleur de mes ennemis avec la fonction statique hsl() avec un math.random

        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x) // Formule pour déterminer l'angle d'apparition de l'ennemis par rapport au centre du canvas et ainsi donner une direction à mes ennemis

        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        aEnnemis.push( // Dans mon tableau aEnnemis tu rajoute
            new Ennemi(x, y, radius, color, velocity)  // Un nouvel ennemi
        )
    }, 1000) // Ici je régle l'intervalle de temps entre chaque apparition d'ennemis
}

let animationId // Je crée cette variable qui me permettra d'arreter la boucle quand je détecte une collision
let score = 0 // Je crée la variable pour mon score
// Creation de l'animation de ennemis et de mes projectiles
function animate() {
    animationId = requestAnimationFrame(animate); // Fonction statique permettant de lancer une boucle sur elle-même, je place donc cette fonction dans ma variable
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)' // Je choisi la couleur de mon background (noir) et en mettant 0.1 j'ajoute un effet shadow qui agit sur l'ensemble des élements
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Je nettoie le canvas a chaque fois pour eviter la trainée laisser par les projectiles
    player.dessine(); // J'affiche le nouveau joueur dans mon canvas

    aParticules.forEach((particule, index) => { // Pour chacunes des particules qui se trouvent dans mon tableau aProjectiles
        if (particule.alpha <= 0) { // Si la variable alpha de mon objet particule est < ou = à 0 alors
            aParticules.splice(index, 1) // Retire la particule de l'écran
        } else { // Sinon
            particule.update() // Tu continue à lui appliquer la méthode update() de l'objet particule
        }
    })

    aProjectiles.forEach((projectile, index) => { // Pour chacun des projectiles qui se trouvent dans mon tableau aProjectiles
        projectile.update() // Tu lui applique update()

        // Retrait des projectiles en dehors de l'écran
        if (projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) { // Ce sont les coordonnées de sortie d'écran en dynamique
            setTimeout(() => {
                aProjectiles.splice(index, 1)
            }, 0);
        }
    });

    aEnnemis.forEach((ennemi, index) => { // Pour chacun des ennemis qui se trouvent dans mon tableau aEnnemis
        ennemi.update() // Tu lui applique update()

        const distance = Math.hypot(player.x - ennemi.x, player.y - ennemi.y) // Je peux me servir de la const distance à deux endroits différents car elle ne sont pas appellé dans le même "niveau" de fonction

        // Collisions avec le joueur mettant fin à la partie
        if (distance - ennemi.radius - player.radius < 1) {
            cancelAnimationFrame(animationId) // Fonction statique pour arréter la bouche de requestAnimation Frame grâce à ma variable animationId initié plus haut
            modal_gameUi.style.display = 'flex'
            scorePoints.innerHTML = score
            if (score > checkBestScore) {
                checkBestScore = score
                bestScore.innerHTML = checkBestScore
            }
        }

        aProjectiles.forEach((projectile, projectileIndex) => { // je crée la collision entre mes projectiles et mes ennemis
            const distance = Math.hypot(projectile.x - ennemi.x, projectile.y - ennemi.y) // Hypot est une fonction statique qui calcule la distance entre deux coordonnées

            // Collisions des projectiles sur l'ennemi
            if (distance - ennemi.radius - projectile.radius < 1) {

                // Création des particules au moment de la collision
                for (let i = 0; i < 8; i++) { 
                    aParticules.push( // Dans mon tableau aParticules tu rajoute
                        new Particule ( // Une nouvelle particule
                            projectile.x, // Coordonnées X
                            projectile.y, // Coordonnées y
                            Math.random() * 2, // Radius
                            ennemi.color, // color
                            { // Velocity. J'ouvre les {} pour dire qu'il y aura deux valeurs. velocity.x et velocity.y
                                x : (Math.random() - 0.5) * (Math.random() * 6),
                                y : (Math.random()) - 0.5  * (Math.random() * 6),
                            }))
                    
                }

                // Si le radius de l'ennemi touché réduit de 10 est plus gros que 5 alors tu lui réduis sa taille
                if (ennemi.radius - 10 > 5) {
                    // Augmente le score quand l'ennemi est touché
                    score += 100
                    scoreElement.innerHTML = score
                    gsap.to(ennemi, { // Fonction statique de la librairie rajouté dans le head au dessus du JS permettant les animations de rétrecissement sur les gros ennemis
                        radius : ennemi.radius - 10 // Réduis le radius de l'ennemi
                    })
                    aProjectiles.splice(projectileIndex, 1) // Retire le projectile
                  // Sinon tu l'enléves de l'écran
                } else {
                    // Augmente le score quand l'ennemi est tué
                    score += 250
                    scoreElement.innerHTML = score
                    setTimeout(() => {
                        aEnnemis.splice(index, 1) // Retire l'ennemi tué
                        aProjectiles.splice(projectileIndex, 1) // Retire le projectile
                    }, 0);
                }
            }
        })
    });
};

window.addEventListener('click', (event) => { // event ici fait ref à l'évenement qui a lieu lorsque je clique avec ma souris. Donc tout ce que je met dans cette fonction s'éxecute lorsque je clique
    // console.log(event) // Regarder le console.log, event.clientX et Y sont les coordonnées retenu de l'endroit ou je clique avec ma souris. Client est le nom de la variable (statique)

    const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2) // Formule pour déterminer l'angle cliqué par rapport au centre du canvas et ainsi donner une direction à mes projectiles

    const velocity = { // 
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    }

    aProjectiles.push( // Dans mon tableau aProjectiles tu rajoute
        new Projectile( // un nouveau projectile avec les paramètres suivant
            canvas.width / 2, // Coordonnées X
            canvas.height / 2, // Coordonnées Y
            5, // Radius
            'white', // Color
            velocity
        )
    )
});

function btn_start_game() {
    initialisation()
    animate()
    spawnEnnemis()
    modal_gameUi.style.display = 'none'
};

// btn_start_game.addEventListener('click', () => {
//         initialisation()
//         animate()
//         spawnEnnemis()
//         modal_gameUi.style.display = 'none'
// });



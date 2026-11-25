
const API = "https://pokeapi.co/api/v2/pokemon/";

let pokemonAtual = 1;

// TRADUÇÃO DOS TIPOS

const traducaoTipos = {
    normal: "Normal",
    fire: "Fogo",
    water: "Água",
    electric: "Elétrico",
    grass: "Grama",
    ice: "Gelo",
    fighting: "Lutador",
    poison: "Veneno",
    ground: "Terra",
    flying: "Voador",
    psychic: "Psíquico",
    bug: "Inseto",
    rock: "Pedra",
    ghost: "Fantasma",
    dragon: "Dragão",
    dark: "Sombrio",
    steel: "Aço",
    fairy: "Fada"
};

// TRADUÇÃO DOS ATRIBUTOS

const nomesAtributos = {
    hp: "HP",
    attack: "Ataque",
    defense: "Defesa",
    "special-attack": "Atq. Especial",
    "special-defense": "Def. Especial",
    speed: "Velocidade"
};

// FUNÇÃO DE BUSCA

async function buscarPokemon(valor = null) {

    const pesquisa = document.getElementById("nomePokemon");
    const mensagem = document.getElementById("mensagem");

    const pokemon = String(valor ?? pesquisa.value)
        .trim()
        .toLowerCase();

    if (!pokemon) {
        mensagem.textContent = "Digite um nome ou número!";
        return;
    }

    mensagem.textContent = "Carregando Pokémon...";

    try {

        const resposta = await fetch(API + encodeURIComponent(pokemon));

        if (!resposta.ok) {
            throw new Error("Pokémon não encontrado!");
        }

        const dados = await resposta.json();

        pokemonAtual = dados.id;

        // NÚMERO

        document.getElementById("numero").textContent =
            "#" + String(dados.id).padStart(3, "0");

        // NOME

        document.getElementById("nome").textContent =
            dados.name;

        // IMAGEM

        const imagem =
            dados.sprites.other["official-artwork"].front_default ||
            dados.sprites.front_default;

        document.getElementById("imagem").src = imagem || "";

        // ALTURA

        document.getElementById("altura").textContent =
            (dados.height / 10).toFixed(1) + " m";

        // PESO

        document.getElementById("peso").textContent =
            (dados.weight / 10).toFixed(1) + " kg";

        // TIPOS

        const tipos = document.getElementById("tipos");

        tipos.innerHTML = "";

        dados.types.forEach(item => {

            const tipo = document.createElement("span");

            tipo.classList.add("tipo");

            tipo.textContent =
                traducaoTipos[item.type.name] || item.type.name;

            tipos.appendChild(tipo);

        });

        // HABILIDADES

        const habilidades = dados.abilities.map(item => {
            return item.ability.name;
        });

        document.getElementById("habilidades").textContent =
            habilidades.join(", ");

        // BARRAS DE ATRIBUTOS

        const listaAtributos =
            document.getElementById("listaAtributos");

        listaAtributos.innerHTML = "";

        dados.stats.forEach(item => {

            const nome = nomesAtributos[item.stat.name];
            const valor = item.base_stat;

            // PORCENTAGEM DA BARRA

            const porcentagem = Math.min(
                (valor / 255) * 100,
                100
            );

            const atributo = document.createElement("div");

            atributo.classList.add("atributo");

            atributo.innerHTML = `
                <span>${nome}</span>

                <div class="barra">
                    <div class="progresso"
                        style="width: ${porcentagem}%">
                    </div>
                </div>

                <strong>${valor}</strong>
            `;

            listaAtributos.appendChild(atributo);

        });

        // LIMPA MENSAGEM E PESQUISA

        mensagem.textContent = "";
        pesquisa.value = "";

    } catch (erro) {

        mensagem.textContent = erro.message;

    }

}

// POKÉMON ANTERIOR

function pokemonAnterior() {

    if (pokemonAtual > 1) {
        buscarPokemon(pokemonAtual - 1);
    }

}

// PRÓXIMO POKÉMON

function pokemonProximo() {

    buscarPokemon(pokemonAtual + 1);

}

// PESQUISA COM ENTER

document.getElementById("nomePokemon")
    .addEventListener("keydown", function(event) {

        if (event.key === "Enter") {
            buscarPokemon();
        }

    });

// CARREGA O BULBASAUR AO ABRIR

buscarPokemon(1);

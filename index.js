const gruposPerguntas = [
    {
        nome: '',
        title: 'Pessoal',
        perguntas: [
            'Tenho dedo podre no amor?',
            'Tenho inveja do meu parceiro em alguma área da vida?',
            'Comumente me envolvo em relacionamentos abusivos?',
            'Tenho dificuldade em lidar com críticas?',
            'Frequentemente me decepciono com alguém?',
            'Tenho dificuldade em confiar nas pessoas?',
            'Tenho boa comunicação com as pessoas?',
            'Penso ou já pensei em suicídio nos últimos 2 meses?',
            'Me sinto sozinho mesmo no meio de pessoas?',
            'Sinto necessidade de chorar mas não me permito fazê-lo?',
            'Se demitido me sinto humilhado e demoro a reorganizar minhas emoções?',
            'Prefiro trabalhar para mim do que ser contratado por alguém?',
            'Mesmo ganhando bem estou sempre endividado?',
            'Me sinto confortável em lugares cheios?'
        ]
    },
    {
        nome: "",
        title: 'Amorosa',
        perguntas: [
            'Não consigo manter um relacionamento por muito tempo?',
            'Com o tempo enjôo da relação?',
            'Sou muito ciumento ou possessivo com meu parceiro?',
            'Costumo ser muito bonzinho com todo mundo?',
            'Tenho facilidade em fazer amigos?',
            'É comum as pessoas me fazerem de bobo?',
            'Sou uma pessoa organizada?',
            'Tenho medo do abandono?',
            'Penso que ninguém me ama de verdade?',
            'As pessoas me vêem como forte mas sinto que sou frágil?',
            'Não sei muito bem o que busco na minha vida? ',
            'Mesmo insatisfeito me mantenho no mesmo trabalho por muitos anos?',
            'Gosto de festas e ocasiões onde há muitas pessoas?',
            'Prefiro ficar sozinho?'
        ]
    },
    {
        nome: "",
        title: 'Amizade',
        perguntas: [
            'Penso que as coisas devem ser do meu jeito?',
            'Tenho dificuldade em dar/receber carinho?',
            'Primeiro meu parceiro, depois eu?',
            'Tenho dificuldade em dizer não?',
            'Sou popular e rodeada de pessoas?',
            'Gosto mais de português que matemática?',
            'Começo e termino as coisas que me disponho a fazer?',
            'Costumo comer, comprar ou me utilizar de outros vícios compulsivamente?',
            'Procuro agradar as pessoas mesmo que me prejudique?',
            'Tenho dificuldade em lidar com hierarquia?',
            'Não penso duas vezes se precisar discutir com meu superior?',
            'Mesmo não gostando no trabalho, se pagar bem vale a pena?',
            'Gosto de conhecer gente nova?',
            'Não gosto de me expor publicamente (apresentações, palestras, trabalhos, etc)?'
        ]
    },
    {
        nome: "",
        title: 'Profissional',
        perguntas: [
            'Faço o perfil mandão?',
            'Gosto muito de fazer sexo com meu parceiro?',
            'Mesmo insatisfeito me mantenho no relacionamento com a esperança de um dia melhorar?',
            'A opinião das pessoas é muito importante para mim?',
            'Costumo me envolver em várias coisas ao mesmo tempo?', 
            'Tenho disciplina e foco na vida?',
            'Sou impulsivo quando estou com raiva?',
            'Sinto que não sou capaz de alcançar meus objetivos?',
            'Minha criação foi muito rígida?',
            'Geralmente me destaco nas coisas que faço no trabalho?',
            'Me sinto mal quando recebo ordens?',
            'Sou organizado em minhas finanças?',
            'Na escola/faculdade os trabalhos em grupo eram terríveis para mim?'
        ]
    },
];

let currentGroupIndex = 0;
let currentQuestionIndex = 0;
let resultados = [];
let respostasSim = 0;
let respostasNao = 0;

const questionContainer = document.getElementById('question-container');
const groupTitle = document.getElementById('group-title');
const question = document.getElementById('question');
const answerForm = document.getElementById('answer-form');
const resultadoElement = document.getElementById('resultado');
const enviarResultado = document.getElementById('salvarResposta');

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function exibirPergunta() {
    const currentGroup = gruposPerguntas[currentGroupIndex];
    const currentQuestion = currentGroup.perguntas[currentQuestionIndex];

    groupTitle.textContent = currentGroup.title;
    question.textContent = currentQuestion;

    // Mostra o formulário de resposta
    answerForm.classList.remove('hidden');
}

function calcularRespostas() {
    // Coleta a resposta selecionada pelo usuário
    const resposta = document.querySelector('input[name="answer"]:checked').value;

    // Incrementa o contador de respostas para o grupo atual
    if (resposta === 'sim') {
        respostasSim++;
    } else {
        respostasNao++;
    }
    
    resultados[currentGroupIndex][resposta]++;

    // Passa para a próxima pergunta ou grupo
    currentGroupIndex++;
    if (currentGroupIndex >= gruposPerguntas.length) {
        currentGroupIndex = 0;
        currentQuestionIndex++;
    }

    // Se todas as perguntas foram respondidas, exibe o resultado final
    if (currentQuestionIndex >= gruposPerguntas[0].perguntas.length) {
        mostrarResultado();
        $("#quest").addClass('hidden');
        $("#modal").removeClass('hidden');
    } else {
        exibirPergunta();
    }
}

function mostrarResultado() {
    resultadoElement.innerHTML = '';

    // Exibe o resultado principal (problema paterno ou materno)
    let mensagemPrincipal = respostasSim > respostasNao ? 'Problema paterno' : 'Problema materno';
    resultadoElement.innerHTML += `<p>Resultado principal: ${mensagemPrincipal}</p>`;
}

function salvarResultadosNaPlanilha() {
    const apiURL = 'https://api.sheetmonkey.io/form/3m1vGSyKv9idvhSJwAdzVp';

    // Coleta informações do usuário
    const nome = document.getElementById('nome').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const nascimento = document.getElementById('nascimento').value;

    // Cria um objeto com todos os resultados, cada grupo como coluna
    const data = {
        "NOME": nome,
        "WHATSAPP": whatsapp,
        "NASCIMENTO": nascimento,
        "Resultado Principal": respostasSim > respostasNao ? 'Problema paterno' : 'Problema materno'
    };
    gruposPerguntas.forEach((grupo, index) => {
        data[grupo.title] = `Sim: ${resultados[index].sim}, Não: ${resultados[index].nao}`;
    });

    fetch(apiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch(error => console.error('Error:', error));
}

answerForm.addEventListener('submit', function(event) {
    event.preventDefault();
    calcularRespostas();
});

// Inicializa os resultados com contadores zerados
gruposPerguntas.forEach(() => {
    resultados.push({ sim: 0, nao: 0 });
});

// Embaralha a ordem das perguntas em cada grupo
gruposPerguntas.forEach(grupo => {
    shuffleArray(grupo.perguntas);
});

exibirPergunta();

enviarResultado.addEventListener('click', function(){
    function enviarPorWhatsApp() {
        const mensagens = []; // Array para armazenar as mensagens de todos os grupos

        // Adiciona o resultado principal ao array de mensagens
        let mensagemPrincipal = respostasSim > respostasNao ? 'Problema paterno' : 'Problema materno';
        mensagens.push(`\n\n*Resultado principal:* ${mensagemPrincipal}`);

        // Substitua 'NúmeroDoWhatsAppDestino' pelo número de telefone para o qual deseja enviar as mensagens
        const numeroDestino = '5521982565890';

        // Formatar todas as mensagens para o WhatsApp
        const mensagensFormatadas = mensagens.map(mensagem => encodeURIComponent(mensagem)).join('%0A%0A');

        // Criar o link para abrir o WhatsApp Web com as mensagens preenchidas
        const linkWhatsApp = `https://wa.me/${numeroDestino}?text=Ol%C3%A1+Dra.+%2AAqui+est%C3%A1+o+meu+Resultado%3A%2A${mensagensFormatadas}`;
    
        // Abrir o link em uma nova aba
        window.open(linkWhatsApp);
    }

    // Chamada da função para enviar as respostas pelo WhatsApp
    enviarPorWhatsApp();

    // Salva os resultados na planilha
    salvarResultadosNaPlanilha();
});

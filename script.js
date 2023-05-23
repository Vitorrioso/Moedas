window.addEventListener('load', function() {
    var selectMoedaOrigem = document.getElementById('select-moeda-origem');
    var inputValor = document.getElementById('input-valor');
    var btnConverter = document.getElementById('btn-converter');
    var resultadoDiv = document.getElementById('resultado');

    btnConverter.addEventListener('click', function() {
        var moedaOrigem = selectMoedaOrigem.value.toUpperCase();
        var valor = parseFloat(inputValor.value);
        converterMoeda(moedaOrigem, valor);
    });

    function converterMoeda(moedaOrigem, valor) {
        var request = new XMLHttpRequest();
        request.open('GET', `https://economia.awesomeapi.com.br/json/last/${moedaOrigem}`, true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                var data = JSON.parse(request.responseText);
                if (data) {
                  moedaOrigem = moedaOrigem.split('-');
                  console.log(moedaOrigem);
                    var taxaOrigem = parseFloat(data[moedaOrigem[0] + moedaOrigem[1]].bid);
                    var valorConvertido = (valor * taxaOrigem);
                    resultadoDiv.innerHTML = valor + ' ' + moedaOrigem[0] + ' = ' + valorConvertido.toFixed(2) + ' ' + moedaOrigem[1] ;
                } else {
                    resultadoDiv.innerHTML = 'Moeda não encontrada';
                }
            } else {
                console.log('Erro ao carregar dados da API');
            }
        };

        request.onerror = function() {
            console.log('Erro de conexão');
        };

        request.send();
    }

    function preencherMoedas(data) {
        var htmlOptions = '';
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var moeda = data[key];
                htmlOptions += '<option value="' + moeda.code + '-' + moeda.codein + '">' + moeda.name + ' (' + moeda.code + ') '+ ' / ' +' (' + moeda.codein + ')</option>';
            }
        }
        selectMoedaOrigem.innerHTML = htmlOptions;
    }

    var requestMoedas = new XMLHttpRequest();
    requestMoedas.open('GET', 'https://economia.awesomeapi.com.br/json/last/BTC-BRL,BTC-USD,BRL-USD', true);

    requestMoedas.onload = function() {
        if (requestMoedas.status >= 200 && requestMoedas.status < 400) {
            var dataMoedas = JSON.parse(requestMoedas.responseText);
            preencherMoedas(dataMoedas);
        } else {
            console.log('Erro ao carregar dados da API');
        }
    };

    requestMoedas.onerror = function() {
        console.log('Erro de conexão');
    };

    requestMoedas.send();
});

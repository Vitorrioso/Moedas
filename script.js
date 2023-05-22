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

    function converterMoeda(moedaOrigem, valor, moedaPara) {
        var request = new XMLHttpRequest();
        request.open('GET', 'https://economia.awesomeapi.com.br/json/all', true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                var data = JSON.parse(request.responseText);

                if (data.hasOwnProperty(moedaOrigem, moedaPara)) {
                    var taxaOrigem = parseFloat(data[moedaOrigem].bid);
                    var valorConvertido = (valor * taxaOrigem);
                    resultadoDiv.innerHTML = valor + ' ' + moedaOrigem + ' = ' + valorConvertido.toFixed(2) + ' ' + moedaPara ;
//                    resultadoDiv.innerHTML = valor + ' ' + moedaOrigem + ' = ' + valorConvertido.toFixed(2);
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
                htmlOptions += '<option value="' + moeda.code + '">' + moeda.name + ' (' + moeda.code + ') '+ ' / ' +' (' + moeda.codein + ')</option>';
            }
        }
        selectMoedaOrigem.innerHTML = htmlOptions;
    }

    var requestMoedas = new XMLHttpRequest();
    requestMoedas.open('GET', 'https://economia.awesomeapi.com.br/json/all', true);

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

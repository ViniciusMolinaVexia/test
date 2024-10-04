/* Ocultar barra ao clicar em LogOff */
$('#btnLogOff').click(function () {
    $('#btnCollapse').click();
});


// Função que quando chamada no onclick, vai para o topo da página
function irParaOTopoDaPagina() {
    $('body,html').animate({
        scrollTop: 0
    }, 500);
    return false;

}
// Função que quando chamada no onclick, vai para a base da página
// Para ir para a base da página é necessário incluir a class 'base', em algum elemento que se encontra na parte de baixo da página
function irParaABaseDaPagina() {
    $("html, body").animate({scrollTop: $('.base').offset().top}, 500);


}
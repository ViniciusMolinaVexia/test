function CarregaComboPrioridades(Combo) {
    var lista;
    lista = Sessao.getObjDaSessao(COMBO_PRIORIDADES);
    if (!lista) {
        lista = Combo.listarPrioridades(function(result) {
            Sessao.gravaObjNaSessao(result, COMBO_PRIORIDADES);
        });
    }
    return lista;
}

function CarregaComboTipoRequisicao(Combo) {
    var lista;
    
    lista = Sessao.getObjDaSessao(COMBO_TIPO_REQUISICAO);
    if (!lista) {
        lista = Combo.listarTipoRequisicao(function(result) {
            Sessao.gravaObjNaSessao(result, COMBO_TIPO_REQUISICAO);
        });
    }


    return lista;
}

function CarregaComboIdiomas(Combo) {
    var lista = [
        { codigo: 'pt', descricao: 'Português' },
        { codigo: 'es', descricao: 'Espanhol' }
    ];

    
    return lista;
}

function CarregaComboEapMultiEmpresa(Combo) {
    var lista;
    //lista = Sessao.getObjDaSessao(COMBO_EAP_MULTI_EMPRESA);
    lista = Combo.listarEapMultiEmpresa(function(result) {});
    return lista;
}

function CarregaComboTodasEapMultiEmpresa(Combo) {
    var lista;
    //lista = Sessao.getObjDaSessao(COMBO_EAP_MULTI_EMPRESA);
    lista = Combo.listarTodasEapMultiEmpresa(function(result) {});
    return lista;
}

function CarregaComboGerenteCustos(Combo) {
    var lista;
    lista = Sessao.getObjDaSessao(COMBO_GERENTE_CUSTOS);
    if (!lista) {
        lista = Combo.listarGerentesCustos(function(result) {
            Sessao.gravaObjNaSessao(result, COMBO_GERENTE_CUSTOS);
        });
    }
    return lista;
}

function CarregaComboGerenteCustosEap(Combo, eap) {
    var lista = [];
    lista = Combo.listarGerentesCustos(eap, function(result) {
        Sessao.gravaObjNaSessao(result, COMBO_GERENTE_CUSTOS);
    });
    return lista;
}

function CarregaComboEquipeCustosEap(Combo, eap) {
    var lista = [];
    lista = Combo.listarEquipeCustos(eap, function(result) {
        Sessao.gravaObjNaSessao(result, COMBO_EQUIPE_CUSTOS);
    });
    return lista;
}

function CarregaComboDepositos(Combo) {
    var lista;
    lista = Combo.listarDepositos(function(result) {});
    return lista;
}

function CarregaComboCentros(Combo) {
    var lista;
    let valor = $('idiomaSelecionado').val();
    lista = Combo.listarCentros(function(result) {});

   
    return lista;
}

function CarregaComboAreas(Combo, idioma) {
    var listaFiltrada = [];

    // Chama a função listarAreas que deve retornar as áreas
    Combo.listarAreas(function(result) {
        // Filtra a lista com base no idioma fornecido
        listaFiltrada = result.filter(function(area) {
            return area.idioma === idioma; // Filtra por idioma
        });
    });

    return listaFiltrada; // Retorna a lista filtrada
}


function CarregaComboCodigoSap(Combo) {
    var lista;
    lista = Combo.listarCodigoSap(function(result) {});
    return lista;
}

function CarregaComboPerfis(Combo) {
    var lista;
    lista = Combo.listarPerfis(function(result) {});
    return lista;
}

function CarregaComboDepositosTemporarios(Combo) {
    var lista;
    lista = Sessao.getObjDaSessao(COMBO_DEPOSITOS_TEMPORARIOS);
    if (!lista) {
        lista = Combo.listarDepositosTemporarios(function(result) {
            Sessao.gravaObjNaSessao(result, COMBO_DEPOSITOS_TEMPORARIOS);
        });
    }
    return lista;
}

function CarregaComboGerenteObra(Combo) {
    var lista;
    lista = Sessao.getObjDaSessao(COMBO_GERENTE_OBRA);
    if (!lista) {
        lista = Combo.listarGerentesObra(function(result) {
            Sessao.gravaObjNaSessao(result, COMBO_GERENTE_OBRA);
        });
    }
    return lista;
}

function CarregaComboUnidadeMedida(Combo) {
    var lista;
    lista = Sessao.getObjDaSessao(COMBO_UNIDADE_MEDIDA);
    if (!lista) {
        lista = Combo.listarUnidadeMedida(function(result) {
            Sessao.gravaObjNaSessao(result, COMBO_UNIDADE_MEDIDA);
        });
    }
    return lista;
}

function CarregaComboStatus(Combo) {
    var lista;
    lista = Sessao.getObjDaSessao(COMBO_STATUS);
    if (!lista) {
        lista = Combo.listarStatus(function(result) {
            Sessao.gravaObjNaSessao(result, COMBO_STATUS);
        });
    }
    return lista;
}

function CarregaComboComprador(Combo) {
    var lista;
    lista = Sessao.getObjDaSessao(COMBO_COMPRADOR);
    if (!lista) {
        lista = Combo.listarComprador(function(result) {
            Sessao.gravaObjNaSessao(result, COMBO_COMPRADOR);
        });
    }
    return lista;
}

function CarregaComboEquipeCustos(Combo) {
    var lista;
    lista = Sessao.getObjDaSessao(COMBO_EQUIPE_CUSTOS);
    if (!lista) {
        lista = Combo.listarEquipeCustos(function(result) {
            Sessao.gravaObjNaSessao(result, COMBO_EQUIPE_CUSTOS);
        });
    }
    return lista;
}

function CarregaComboLiderCustos(Combo) {
    var lista;
    lista = Sessao.getObjDaSessao(COMBO_LIDER_CUSTOS);
    if (!lista) {
        lista = Combo.listarLiderCustos(function(result) {
            Sessao.gravaObjNaSessao(result, COMBO_LIDER_CUSTOS);
        });
    }
    return lista;
}

function CarregaComboCoordenador(Combo) {
    var lista;
    lista = Sessao.getObjDaSessao(COMBO_COORDENADOR);
    if (!lista) {
        lista = Combo.listarCoordenadores(function(result) {
            Sessao.gravaObjNaSessao(result, COMBO_COORDENADOR);
        });
    }
    return lista;
}

/**
 * Metodo que recarrega os combos quando houver alterações nos registros
 */
function RecarregaCombo(nomeCombo, rootScope) {
    var lista = Sessao.getObjDaSessao(nomeCombo);
    if (lista && lista.length > 0) {
        Sessao.excluiObjDaSessao(nomeCombo);
    }
    if (rootScope) {
        rootScope.$broadcast(nomeCombo);
    }
}
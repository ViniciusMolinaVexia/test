/* 
*  Nextage License 
*  Copyright 2016 - Nextage 
*/
function FiltroLogInterface() { 
	/**
	* @author Nextage
	* @param {FiltroLogInterface} filtro
	* @description Popula Filtro do sistema.
	*/
	this.getFiltroLogInterface = function (filtro) { 
		var newLogInterface = { 
			sistema: filtro.sistema, 
			interfaceExec: filtro.interfaceExec, 
			numRma: filtro.numRma, 
			codigoDeposito: filtro.codigoDeposito, 
			itemRequisicaoSap: filtro.itemRequisicaoSap, 
			numRequisicaoSap: filtro.numRequisicaoSap, 
			numPedidoSap: filtro.numPedidoSap, 
			dataHoraInclusaoLogInicio : filtro.dataHoraInclusaoLogInicio , 
			dataHoraInclusaoLogFim: filtro.dataHoraInclusaoLogFim , 
			stDataHoraInclusaoLogInicio : filtro.stDataHoraInclusaoLogInicio , 
			stDataHoraInclusaoLogFim: filtro.stDataHoraInclusaoLogFim , 
			usuarioInclusao: filtro.usuarioInclusao, 
			json: filtro.json, 
			mensagem: filtro.mensagem, 
			tipoMensagem: filtro.tipoMensagem, 
			erroMensagem: filtro.erroMensagem, 
			paginacaoVo: filtro.paginacaoVo 
		}; 
		return newLogInterface; 
	}; 
 
	/**
	* @author Nextage
	* @description Cria novo Objeto de Filtro
	*/
	this.getNovoFiltroLogInterface = function () { 
		var newLogInterface = { 
			sistema: "", 
			interfaceExec: "", 
			numRma: "", 
			codigoDeposito: "", 
			itemRequisicaoSap: "", 
			numRequisicaoSap: "", 
			numPedidoSap: "", 
			stdataHoraInclusaoLogInicio :  "" , 
			stdataHoraInclusaoLogFim : "" , 
			usuarioInclusao: "", 
			json: "", 
			mensagem: "", 
			tipoMensagem: "", 
			erroMensagem: "", 
			paginacaoVo: null 
		}; 
		return newLogInterface;
	}; 

}
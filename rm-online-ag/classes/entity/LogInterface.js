/* 
*  Nextage License
*  Copyright 2016 - Nextage
*/
function LogInterface() { 
	/**
	* @author Nextage
	* @param {loginterface} obj
	* @description Popula objeto do sistema.
	*/
	this.getLogInterface = function (obj) { 
		var newLogInterface = { 
			sistema: obj.sistema,
			id: obj.id,
			interfaceExec: obj.interfaceExec,
			numRma: obj.numRma,
			codigoDeposito: obj.codigoDeposito,
			itemRequisicaoSap: obj.itemRequisicaoSap,
			numRequisicaoSap: obj.numRequisicaoSap,
			numPedidoSap: obj.numPedidoSap,
			dataHoraInclusaoLog: obj.dataHoraInclusaoLog,
			stDataHoraInclusaoLog: obj.stDataHoraInclusaoLog,
			usuarioInclusao: obj.usuarioInclusao,
			json: obj.json,
			mensagem: obj.mensagem,
			tipoMensagem: obj.tipoMensagem,
			erroMensagem: obj.erroMensagem,
			equals: this.equals 
		}; 
		return newLogInterface; 
	}; 
	/**
	* @author Nextage
	* @description Cria novo Objeto
	*/
	this.getNovoLogInterface = function () { 
		var newLogInterface = { 
			sistema: "", 
			id: 0, 
			interfaceExec: "", 
			numRma: "", 
			codigoDeposito: "", 
			itemRequisicaoSap: "", 
			numRequisicaoSap: "", 
			numPedidoSap: "", 
			dataHoraInclusaoLog: null, 
			stDataHoraInclusaoLog: null,
			usuarioInclusao: "", 
			json: "", 
			mensagem: "", 
			tipoMensagem: "", 
			erroMensagem: "", 
			equals: this.equals 
		}; 
		return newLogInterface; 
	}; 
	/**
	* @author Nextage
	* @param loginterface
	* @description Implementação do metodo equals
	*/
	this.equals = function (loginterface) {
		if (loginterface.id === this.id) {
			return true;
		} 
		return false; 
	}; 

}
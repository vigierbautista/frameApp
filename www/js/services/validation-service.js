/**
 * Definimos el servicio de Validación de datos.
 * Este servicio se va a encargar de validar los datos que ingrese el usuario.
 */
angular.module('FrameApp.services')
	.service('ValidationService', [
		function() {
			var self = this,
				_data,
				_rules,
				_msgs,
				_errors = {};

			/**
			 * Validator Constructor
			 * @param data
			 * @param rules
			 * @param msgs
			 */
			this.init = function (data, rules, msgs) {
				_data = data;
				_rules = rules;
				_msgs = msgs;
				_errors = {};
				validate();
				return self;
			};

			/**
			 * LLama a la validación de cada regla.
			 */
			 var validate = function () {
				for (var field in _rules) {
					if(_rules.hasOwnProperty(field)) {

						for (var rule in _rules[field]) {
							if(_rules[field].hasOwnProperty(rule)) {

								var rule_value = _rules[field][rule];
								if (rule_value) {
									if (!callValidation(rule, field)) break;
								}

							}
						}

					}
				}
			};

			/**
			 * LLama define los parametros que tiene que recibir el metodo de validación.
			 * @param rule
			 * @param field
			 * @return {*}
			 */
			var callValidation = function (rule, field) {

				var ruleData = rule.split(':');
				var method = '_' + ruleData[0];

				if (self.hasOwnProperty(method)) {

					if (typeof self[method] == 'function') {

						switch (ruleData.length) {
							case 1:
								return self[method](field);
							case 2:
								return self[method](field, ruleData[1]);
							case 3:
								return self[method](field, ruleData[1], ruleData[2]);
						}

					} else {
						console.error('Undefined validation method: ' + rule + ', for field: ' + field);
						return false;
					}

				}

			};



			//////////////////////////////////////////
			////////    VALIDATIONS     ///////////
			////////////////////////////////////

			/**
			 * Valida que el campo no esté vacío
			 * @param field
			 * @return {boolean}
			 * @private
			 */
			this._required = function (field) {
				if (_data[field] == '' ||  typeof _data[field] == 'undefined' ||  _data[field] == null) {
					self.addError(field, _msgs[field]['required']);
					return false;
				}

				return true;
			};


			/**
			 * Valida si el campo es más grande que lo indicado.
			 * @param field
			 * @param than
			 * @return {boolean}
			 * @private
			 */
			this._greater = function (field, than) {
				switch (typeof _data[field]) {
					case 'string':
						if (Date.parse(_data[field]) < Date.parse(than)) {
							self.addError(field, _msgs[field]['greater']);
							return false;
						}
						break;

					case 'number':
						if (_data[field] < than) {
							self.addError(field, _msgs[field]['greater']);
							return false;
						}
						break;
				}

				return true;
			};

			/**
			 * Valida si el campo es más chico que lo indicado.
			 * @param field
			 * @param than
			 * @return {boolean}
			 * @private
			 */
			this._smaller = function (field, than) {
				switch (typeof _data[field]) {
					case 'string':
						if (Date.parse(_data[field]) > Date.parse(than)) {
							self.addError(field, _msgs[field]['smaller']);
							return false;
						}
						break;

					case 'number':
						if (_data[field] > than) {
							self.addError(field, _msgs[field]['smaller']);
							return false;
						}
						break;
				}

				return true;
			};

			/**
			 * Valida si el campo es más corto que lo indicado.
			 * @param field
			 * @param than
			 * @return {boolean}
			 * @private
			 */
			this._min = function (field, than) {
				if (_data[field].length < than) {
					self.addError(field, _msgs[field]['min']);
					return false;
				}

				return true;
			};


			/**
			 * Valida si el campo es más largo que lo indicado.
			 * @param field
			 * @param than
			 * @return {boolean}
			 * @private
			 */
			this._max = function (field, than) {
				if (_data[field].length > than) {
					self.addError(field, _msgs[field]['max']);
					return false;
				}

				return true;
			};


			/**
			 * Valida si el campo tiene formato de email.
			 * @param field
			 * @return {boolean}
			 * @private
			 */
			this._email = function (field) {
				var regex = /^([\w-\.]+)@((?:[\w]+\.)+)([a-z]{2,4})/;
				if(!regex.test(_data[field])) {
					self.addError(field, _msgs[field]['email']);
					return false;
				}

				return true;
			};


			/**
			 * Valida que el campo sea numérico.
			 * @param field
			 * @return {boolean}
			 * @private
			 */
			this._numeric = function (field) {
				if(isNaN(_data[field])) {
					self.addError(field, _msgs[field]['numeric']);
					return false;
				}

				return true;
			};


			/**
			 * Valida que el campo sea igual al campo indicado.
			 * @param field
			 * @param otherField
			 * @return {boolean}
			 * @private
			 */
			this._equal = function (field, otherField) {
				if (_data[field] !== _data[otherField]) {
					self.addError(field, _msgs[field]['equal']);
					return false;
				}

				return true;
			};


			/**
			 * Valido que el campo tenga el formato de fecha.
			 * @param field
			 * @return {boolean}
			 * @private
			 */
			this._dateformat = function (field) {
				var regex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
				if (!regex.test(_data[field])) {
					self.addError(field, _msgs[field]['dateformat']);
					return false;
				}

				return true;
			};


			///////////////////////////////////////
			////////    HANDLERS     ///////////
			/////////////////////////////////

			/**
			 * Agrega un error.
			 * @param field
			 * @param msg
			 */
			this.addError = function (field, msg) {
				_errors[field] = msg;
			};


			/**
			 * Retorna los errores.
			 * @return {{}}
			 */
			this.getErrors = function () {
				return _errors;
			};


			/**
			 * Retorna si es válido.
			 * @return {boolean}
			 */
			this.isValid = function () {
				if (_errors.length > 0) return false;

				var length = 0;

				for (var i in _errors) {
					if (_errors.hasOwnProperty(i)) length++;
				}

				return length <= 0;

			};


			/**
			 * Retorna si es inválido.
			 * @return {boolean}
			 */
			this.isInvalid = function () {
				return !self.isValid();
			}
		}
	]);
const fetch = require('node-fetch');
const Sequelize = require('sequelize');
const { cachedDataVersionTag } = require('v8');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

const Monday = sequelize.define('monday', {
	id: {
		type: Sequelize.STRING,
		unique: true,
		primaryKey: true
	},
	min: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
        allowNull: false
    },
	max: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
        allowNull: false
    },
	date: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
    }
});

const Tuesday = sequelize.define('tuesday', {
	id: {
		type: Sequelize.STRING,
		unique: true,
		primaryKey: true
	},
	min: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
        allowNull: false
    },
	max: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
        allowNull: false
    },
	date: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
    }
});

const Wednesday = sequelize.define('wednesday', {
	id: {
		type: Sequelize.STRING,
		unique: true,
		primaryKey: true
	},
	min: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
        allowNull: false
    },
	max: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
        allowNull: false
    },
	date: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
    }
});

const Thursday = sequelize.define('thursday', {
	id: {
		type: Sequelize.STRING,
		unique: true,
		primaryKey: true
	},
	min: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
        allowNull: false
    },
	max: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
        allowNull: false
    },
	date: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
    }
});

const Friday = sequelize.define('friday', {
	id: {
		type: Sequelize.STRING,
		unique: true,
		primaryKey: true
	},
	min: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
        allowNull: false
    },
	max: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
        allowNull: false
    },
	date: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
    }
});

const Saturday = sequelize.define('saturday', {
	id: {
		type: Sequelize.STRING,
		unique: true,
		primaryKey: true
	},
	min: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
        allowNull: false
    },
	max: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
        allowNull: false
	},
	date: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
    }
});

const Sunday = sequelize.define('sunday', {
	id: {
		type: Sequelize.STRING,
		unique: true,
		primaryKey: true
	},
	min: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
        allowNull: false
    },
	max: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
        allowNull: false
    },
	date: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
    }
});


module.exports = {
    name: 'bazaarupdate',
    description: 'Saves the current bazaar data',
    async execute() {
		const {products} = await fetch('https://api.hypixel.net/skyblock/bazaar?key=dd62008c-45c6-47c8-9575-aa8f1ca5928b').then(response => response.json());

		if (!products) {
		console.log("Error: API not found!");
		return;
		}

		for (i in products) {
			//true = items added. //false = already exists or error. with ! means if true -> exists or error!
			let id = products[i].product_id;
			if (products[i].sell_summary["0"] == null || products[i].buy_summary["0"] == null) continue;
			let min = products[i].sell_summary["0"].pricePerUnit;
			let max = products[i].buy_summary["0"].pricePerUnit;
			try {
				if(! await additem(id, min, max)) {
					edititem(id, min, max)
				}
			} catch (e) {}
		}
		//console.log('Updated!');
		return;
    },
    async initialize() {
        Monday.sync();
        Tuesday.sync();
        Wednesday.sync();
        Thursday.sync();
        Friday.sync();
        Saturday.sync();
        Sunday.sync();
		console.log('Database synced!');
		
		const {products} = await fetch('https://api.hypixel.net/skyblock/bazaar?key=dd62008c-45c6-47c8-9575-aa8f1ca5928b').then(response => response.json());
		const Table = getCurrentTable();
		if (Table == null) return;
		
		if (!products) {
			console.log("Error: API not found!");
			return;
		}

		let date = new Date().getDate;
		for (i in products) {
			let id = products[i].product_id;
			product = await Table.findOne({where: {id: id}});
			if (product == null) continue;
			if (product.get('date') != date) {
				Table.update({date: date}, {where: {id: id}});
				Table.update({min: 90071992},{where: {id: id}});
				Table.update({max: 0},{where: {id: id}});
			}
		}
		console.log("Dates adjusted!");
	},
	getTable(n) {//Returns a table based on a given weekday and throws a error.
		let Table;
		switch (n) {
			case 1: {
				Table = Monday;
				break;
			}
			case 2: {
				Table = Tuesday;
				break;
			}
			case 3: {
				Table = Wednesday;
				break;
			}
			case 4: {
				Table = Thursday;
				break;
			}
			case 5: {
				Table = Friday;
				break;
			}
			case 6: {
				Table = Saturday;
				break;
			}
			case 7: {
				Table = Sunday;
				break;
			}
			default: {
				Table = null;
			}
		}
		if (Table == null) {
			console.log('An error has accured. Check if the .getDay() works!')
			return null;
		}
		return Table;
	}
}

async function additem(id, min, max) {
	const Table = getCurrentTable();
	if (Table == null) return true;
	
	try {
		await Table.create({
			id: id,
			min : min,
			max: max,
			date: new Date().getDate()
		});
	} catch (e) {
		return false;
	}
	return true;
}

async function edititem(id, min, max) {
	const Table = getCurrentTable();
	if (Table == null) return;
	try {
	product = await Table.findOne({where: {id: id}});
	
	//get the new mins/maximums.
	let cur_min = product.get('min');
	let cur_max = product.get('max');
	if (min < cur_min) Table.update({min: min}, {where: {id: id}});
	if (max > cur_max) Table.update({max: max}, {where: {id: id}});
	} catch (e) {}
	
}

function getCurrentTable() {//Returns a table based on the current weekday and throws a error.
	let d = new Date();
	let n = d.getDay();
	let Table;
	switch (n) {
		case 1: {
			Table = Monday;
			break;
		}
		case 2: {
			Table = Tuesday;
			break;
		}
		case 3: {
			Table = Wednesday;
			break;
		}
		case 4: {
			Table = Thursday;
			break;
		}
		case 5: {
			Table = Friday;
			break;
		}
		case 6: {
			Table = Saturday;
			break;
		}
		case 7: {
			Table = Sunday;
			break;
		}
		default: {
			Table = null;
		}
	}
	if (Table == null) {
		console.log('An error has accured. Check if the .getDay() works!')
		return null;
	}
	return Table;
}
import POSSale from './pos.model.js';
import POSSaleItem from './positem.model.js';

// POSSale has many POSSaleItems
POSSale.hasMany(POSSaleItem, {
    foreignKey: 'sale_id',
    as: 'items',
    onDelete: 'CASCADE',
});

// POSSaleItem belongs to POSSale
POSSaleItem.belongsTo(POSSale, {
    foreignKey: 'sale_id',
    as: 'sale',
});

export { POSSale, POSSaleItem };

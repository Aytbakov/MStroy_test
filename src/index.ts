type Item = {
    id: number|string;
    parent: number|string;
    type?: string|null;
};

class TreeStore {
    // Массив
    private items: Item[];
    // Мапа родительских объектов
    private itemMap: Map<number | string, Item>;
    // Мапа дочерних объектов
    private childrenMap: Map<number | string, Item[]>;


    constructor(items: Item[]) {
        // Инициализируем и создадим мапы
        this.items = items;
        this.itemMap = new Map();
        this.childrenMap = new Map();

        // Запишем мапы для прямого доступа к элементам по их id и их детям
        items.forEach(item => {
            // Запишем объект в мапу по его ID
            this.itemMap.set(item.id, item);

            // Инициализируем пустой массив для хранения дочерних эл-ов
            if (!this.childrenMap.has(item.parent)) {
                this.childrenMap.set(item.parent, []);
            }

            // Добавим элемент в массив дочерних эл-ов
            const children = this.childrenMap.get(item.parent);
            if (children) children.push(item);

        });
    }

    getAll(): Item[] {
        return this.items;
    }

    getItem(id: number|string): Item | undefined {
        return this.itemMap.get(id);
    }

    getChildren(id: number|string): Item[] {
        return this.childrenMap.get(id) || [];
    }

    getAllChildren(id: number|string): Item[] {
        // Инициализируем пустой массив
        const result: Item[] = [];
        // Получим массив дочерних эл-ов
        let queue = this.getChildren(id) || [];

        while (queue.length > 0) {
            // Удалим первый эл-т
            const child = queue.shift();

            if (child) {
                // Запишем эл-т
                result.push(child);
                const children = this.getChildren(child.id) || [];
                // Объединим массивы
                queue = queue.concat(children);
            }
        }

        return result;
    }

    getAllParents(id: number|string): Item[] {
        // Инициализируем пустой массив
        const result: Item[] = [];
        // Получим данные эл-та
        let current = this.itemMap.get(id);

        // Исключим root
        while (current && current.parent !== 'root') {
            const parent = this.itemMap.get(current.parent);

            if (parent) {
                // Вставим данные
                result.push(parent);
                // Обновим текучщий эл-т
                current = parent;
            } else break;
        }

        return result;
    }

}

const items: Item[] = [
    { id: 1, parent: 'root' },
    { id: 2, parent: 1, type: 'test' },
    { id: 3, parent: 1, type: 'test' },

    { id: 4, parent: 2, type: 'test' },
    { id: 5, parent: 2, type: 'test' },
    { id: 6, parent: 2, type: 'test' },

    { id: 7, parent: 4, type: null },
    { id: 8, parent: 4, type: null },
];

const ts = new TreeStore(items);

// Выводит все элементы
console.log('ts.getAll():');
console.log(ts.getAll());
console.log('ts.getItem(7):');
console.log(ts.getItem(7));
console.log('ts.getChildren(4):');
console.log(ts.getChildren(4));
console.log('ts.getChildren(5):');
console.log(ts.getChildren(5));
console.log('ts.getChildren(2):');
console.log(ts.getChildren(2));
console.log('ts.getAllChildren(2):');
console.log(ts.getAllChildren(2));
console.log('ts.getAllParents(7):');
console.log(ts.getAllParents(7));
console.log('END')
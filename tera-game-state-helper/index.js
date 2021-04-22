class TeraGameStateHelper {
    constructor(mod) {
        this.users = new Map;
        this.items = new Map;
        this.continents = new Map;
        this.abnormalities = new Map;

        mod.clientInterface.once('ready', async () => {
            // UserData
            (await mod.queryData('/UserData/Template/', [], true, false, ['id', 'class', 'race', 'gender'])).forEach(result => {
                this.users.set(result.attributes.id, result.attributes);
            });

            // ContinentData
            (await mod.queryData('/ContinentData/Continent/', [], true, false, ['id', 'channelType'])).forEach(result => {
                this.continents.set(result.attributes.id, result.attributes);
            });

            // ItemData / StrSheet_Item
            (await mod.queryData('/ItemData/Item/', [], true, false, ['id', 'combatItemType'])).forEach(result => {
                this.items.set(result.attributes.id, result.attributes);
            });
            (await mod.queryData('/StrSheet_Item/String/', [], true, false)).forEach(result => {
                let item = this.items.get(result.attributes.id);
                if (item)
                    Object.assign(item, {
                        name: result.attributes.string,
                        tooltip: result.attributes.toolTip
                    });
            });

            // Abnormality / StrSheet_Abnormality
            (await mod.queryData('/Abnormality/Abnormal/', [], true, true, ['id', 'bySkillCategory', 'infinity', 'time', 'method', 'tickInterval', 'type', 'value'])).forEach(result => {
                this.abnormalities.set(result.attributes.id, Object.assign(result.attributes, { effects: result.children.map(effect => effect.attributes) }));
            });
            (await mod.queryData('/StrSheet_Abnormality/String/', [], true, false)).forEach(result => {
                let abnormality = this.abnormalities.get(result.attributes.id);
                if (abnormality)
                    Object.assign(abnormality, {
                        name: result.attributes.name,
                        tooltip: result.attributes.tooltip
                    });
            });
        });
    }
}

module.exports = TeraGameStateHelper;

// Apriori.js

var _testDB = [
    'Chó, Mèo, Cá, Hamster, Chim',
    'Mèo, Cá, Cừu',
    'Chó, Mèo, Khỉ, Cừu',
    'Mèo, Cừu, Rồng Nam Mỹ, Chó, Rắn',
    'Rồng Nam Mỹ, Chó, Khỉ, Bọ Cạp'
];

var _db = [];

$(function () {
    SetControlBehaviors();
    $('#ResetDBButton').click();
    $('#ItemsTextBox').focus();
});

///////////////////
// Helper Methods

function SetControlBehaviors() {
    // Set generate-db-button behavior
    $('#GenerateDBButton').click(function () {
        // Read comma-separated items with whitespace removed
        let items = $.trim($('#ItemsTextBox').val());
        let itemsList = items.split(',');
        for (var i in itemsList) {
            itemsList[i] = $.trim(itemsList[i]);
        }

        // Generate random database
        let transCount = parseInt($.trim($('#TransCountTextBox').val()));

        _db = [];
        for (var transIndex = 0; transIndex < transCount;) {
            let itemCount = getRandomInt(1, itemsList.length);
            let itemset = [];

            for (var j = 0; j < itemCount; j += 1) {
                let itemIndex = getRandomInt(1, itemsList.length);
                let item = itemsList[itemIndex - 1];
                if (itemset.indexOf(item) < 0)
                    itemset.push(item);
            }

            if (itemset.length > 0) {
                _db.push(itemset.join(', '));
                transIndex += 1;
            }
        }

        $('#DBTextBox').val(_db.join('\n'));
    });

    // Set reset-db-button behavior
    $('#ResetDBButton').click(function () {
        _db = [];
        _testDB.forEach(i => _db.push(i));

        $('#DBTextBox').val(_db.join('\n'));
    });

    // Set apriori-button behavior
    $('#AprioriButton').click(function () {
        // Tạo ItemsetCollection cho db hiện tại
        let db = new ItemsetCollection();
        for (var i in _db) {
            let items = _db[i].split(', ');
            db.push(Itemset.from(items));
        }

        // Bước1: Tìm các tập hợp vật phẩm lớn cho ngưỡng hỗ trợ nhất định
        let supportThreshold = parseFloat($.trim($('#SupportThresholdTextBox').val()));
        let L = AprioriMining.doApriori(db, supportThreshold);

        ClearResult();
        AddResultLine(L.length + ' Large Itemsets (by Apriori):');
        AddResultLine(L.join('\n\n'));
        AddResultLine('');

        // Bước 2: Xây dựng các quy tắc dựa trên các tập phổ biến lớn và ngưỡng tin cậy
        let confidenceThreshold = parseFloat($.trim($('#ConfidenceThresholdTextBox').val()));
        let allRules = AprioriMining.mine(db, L, confidenceThreshold);
        AddResultLine(allRules.length + " Association Rules");
        AddResultLine(allRules.join('\n\n'));
    });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function AddResultLine(text) {
    $('#ResultTextBox').val($('#ResultTextBox').val() + text + '\n\n');
}

function ClearResult(text) {
    $('#ResultTextBox').val('');
}

function testObjects() {
    var is = new ItemsetCollection();
    is.push(Itemset.from(['ab','bc','c']));
    is.push(Itemset.from(['a','e','f']));
    is.push(Itemset.from(['d','n']));
    
    var i = Itemset.from(['a','b']);
    i.Support = 40;

    var rule1 = new AssociationRule();
    rule1.X = Itemset.from(['a','b']);
    rule1.Y = Itemset.from(['c']);
    rule1.Support = 45.857;
    rule1.Confidence = 80;
}

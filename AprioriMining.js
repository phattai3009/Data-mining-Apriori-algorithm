// AprioriMining.js 

'use strict';

class AprioriMining {
    static doApriori(db, supportThreshold) {
        let I = db.getUniqueItems();
        let L = new ItemsetCollection(); // Tập phổ biến lớn kết quả
        let Li = new ItemsetCollection(); // Tập phổ biến lớn trong mỗi lần lặp
        let Ci = new ItemsetCollection(); // Tập hợp các mục được cắt tỉa trong mỗi lần lặp

        // Lần lặp đầu tiên (tập vật phẩm 1 mục)
        for (var i = 0; i < I.length; i += 1) {
            Ci.push(Itemset.from([I[i]]));
        }

        // Các lần lặp tiếp theo
        let k = 2;
        while (Ci.length != 0) {
            // Đặt Li từ Ci (cắt tỉa)
            Li.clear();
            for (var index in Ci) {
                let itemset = Ci[index];
                itemset.Support = db.findSupport(itemset);
                if (itemset.Support >= supportThreshold) {
                    Li.push(itemset);
                    L.push(itemset);
                }
            }

            // Đặt Ci cho lần lặp tiếp theo (tìm các tập siêu của Li)
            Ci.clear();
            let subsets = Bit.findSubsets(Li.getUniqueItems(), k); // Nhận tập hợp con k-item
            subsets.forEach(set => Ci.push(set));
            k += 1;
        }

        return L;
    }

    static mine(db, L, confidenceThreshold) {
        let allRules = [];
    
        for (var i in L) {
            let itemset = L[i];
            let subsets = Bit.findSubsets(itemset, 0); // Nhận tất cả các tập hợp con

            for (var j in subsets) {
                let subset = subsets[j];
                let confidence = (db.findSupport(itemset) / db.findSupport(subset)) * 100.0;

                if (confidence >= confidenceThreshold) {
                    let rule = new AssociationRule();
                    subset.forEach(i => rule.X.push(i));
                    itemset.removeItemset(subset).forEach(i => rule.Y.push(i));
                    rule.Support = db.findSupport(itemset);
                    rule.Confidence = confidence;

                    if (rule.X.length > 0 && rule.Y.length > 0) {
                        allRules.push(rule);
                    }
                }
            }
        }

        return allRules;
    }
}

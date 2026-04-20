const worksData = [
    {
        id: 1,
        title: "紫花油 510海报",
        category: "poster",
        image: "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/海报/24-紫花油510周年庆APP.jpg",
        images: [
            "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/海报/24-紫花油510周年庆APP.jpg"
        ],
        description: "天猫紫花油旗舰店、510周年庆节的APP端海报设计"
    },
    {
        id: 2,
        title: "日皇 健康节海报",
        category: "poster",
        image: "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/海报/22-日皇健康节APP.jpg",
        images: [
            "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/海报/22-日皇健康节APP.jpg",
            "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/海报/22-日皇健康节PC.jpg"
        ],
        description: "天猫日皇旗舰店、健康节的APP、PC端海报设计"
    },
    {
        id: 3,
        title: "加州宝宝 黑五海报",
        category: "poster",
        image: "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/海报/23-加州宝宝黑五APP.jpg",
        images: [
            "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/海报/23-加州宝宝黑五APP.jpg"
        ],
        description: "京东加州宝宝旗舰店、黑五APP海报设计"
    },
    {
        id: 4,
        title: "BG PRO 日常首页",
        category: "daily-home",
        image: "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/日常首页/24-BG PRO-日常首页APP.jpg",
        images: [
            "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/日常首页/24-BG PRO-日常首页APP.jpg"
        ],
        description: "BG PRO旗舰店  日常首页APP端"
    },
    {
        id: 5,
        title: "便利妥 主图及详情",
        category: "daily-detail",
        image: "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/主图及详情/24-京东健康-便利妥日常详情优化.jpg",
        images: [
            "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/主图及详情/24-京东健康-便利妥日常详情优化.jpg",
            "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/主图及详情/24-京东健康-便利妥日常主图优化-1.jpg",
            "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/主图及详情/24-京东健康-便利妥日常主图优化-5.jpg",
            "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/主图及详情/24-京东健康-便利妥日常主图优化-2.jpg",
            "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/主图及详情/24-京东健康-便利妥日常主图优化-3.jpg",
            "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/主图及详情/24-京东健康-便利妥日常主图优化-4.jpg"
        ],
        description: "京东健康店铺 便利妥产品 主图及详情设计"
    },
    {
        id: 6,
        title: "加州宝宝 618海报",
        category: "poster",
        image: "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/海报/23-618首页APP海报.jpg",
        images: [
            "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/海报/23-618首页APP海报.jpg"
        ],
        description: "京东加州宝宝旗舰店 618海报APP设计"
    },
    {
        id: 7,
        title: "劳动节 公告",
        category: "other",
        image: "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/其他/24-五一公告蚬壳胃散.jpg",
        images: [
            "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/其他/24-五一公告蚬壳胃散.jpg"
        ],
        description: "蚬壳胃散店铺 五一劳动节 放假物流公告"
    },
    {
        id: 8,
        title: "蚬壳胃散推广主图",
        category: "activity-main",
        image: "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/活动主图/24-蚬壳胃散推广主图SHE0076-800.jpg",
        images: [
            "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/活动主图/24-蚬壳胃散推广主图SHE0076-800.jpg"
        ],
        description: ""
    },
    {
        id: 9,
        title: "BG PRO 618首页+活动主图",
        category: "activity-page",
        image: "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/活动页/25-BG PRO-618首页APP.jpg",
        images: [
            "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/活动页/25-BG PRO-618首页APP.jpg",
            "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/活动页/25-BG PRO-618主图800.jpg",
            "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/活动页/25-BG PRO-618主图750.jpg"
        ],
        description: "BG PRO旗舰店 618活动首页+活动主图"
    },
    {
        id: 10,
        title: "正安堂 冲奥燃动季海报",
        category: "poster",
        image: "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/海报/24-正安堂冲奥燃动季.jpg",
        images: [
            "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/海报/24-正安堂冲奥燃动季.jpg"
        ],
        description: "天猫正安堂旗舰店 冲奥燃动季活动APP海报"
    },
    {
        id: 11,
        title: "正安堂 3.8海报",
        category: "poster",
        image: "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/海报/24-正安堂38APP.jpg",
        images: [
            "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/海报/24-正安堂38APP.jpg"
        ],
        description: "天猫正安堂旗舰店 3.8妇女节活动APP海报"
    },
    {
        id: 12,
        title: "康萃乐 621海报",
        category: "poster",
        image: "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/海报/22-康萃乐621海报PC.jpg",
        images: [
            "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/海报/22-康萃乐621海报PC.jpg"
        ],
        description: "康萃乐品牌海报展示"
    },
    {
        id: 13,
        title: "天喜堂 黑五海报",
        category: "poster",
        image: "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/海报/23-天喜堂黑五.jpg",
        images: [
            "https://wwmjw-1423348972.cos.ap-guangzhou.myqcloud.com/images/海报/23-天喜堂黑五.jpg"
        ],
        description: "天喜堂旗舰店 黑五活动 APP海报"
    }
];

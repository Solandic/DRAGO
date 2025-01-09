import { AppDefinitionId } from './app-definition';
import { PageId } from './page';
export var WidgetId;
(function (WidgetId) {
    WidgetId["About"] = "14dbefb9-3b7b-c4e9-53e8-766defd30587";
    WidgetId["MyAccount"] = "14dd1af6-3e02-63db-0ef2-72fbc7cc3136";
    WidgetId["MyRewards"] = "c85a2896-9f7c-4cf1-9bf8-95852cc5219a";
    WidgetId["Groups"] = "e018cc55-7b1c-4500-a2e5-969f22c8a33a";
    WidgetId["ForumPosts"] = "14f0266c-e0a3-afc6-d07c-5be8e20949cd";
    WidgetId["ForumComments"] = "14f51b00-3ada-272e-b6db-34d5da9dd623";
    WidgetId["Events"] = "405eb115-a694-4e2b-abaa-e4762808bb93";
    WidgetId["FollowingFollowers"] = "14ebe825-b273-0d5f-0fd1-e6293322b83b";
    WidgetId["FollowingFollowersLightbox"] = "a26fd26a-3dd9-42ca-b381-326a9c143e38";
    WidgetId["BlogComments"] = "14f260f9-c2eb-50e8-9b3c-4d21861fe58f";
    WidgetId["BlogLikes"] = "14f26109-514f-f9a8-9b3c-4d21861fe58f";
    WidgetId["BlogPosts"] = "14f26118-b65b-b1c1-b6db-34d5da9dd623";
    WidgetId["BlogDrafts"] = "14f260e4-ea13-f861-b0ba-4577df99b961";
    WidgetId["MyPosts"] = "e5a2773b-0e6b-4cbb-a012-3b4a69e92046";
    WidgetId["MyChallenges"] = "384628b7-c716-4410-8fc5-4e2bd5aad178";
    WidgetId["MyPrograms"] = "c88902a1-7fbf-4ff1-b19a-af39c48bc740";
    WidgetId["MySubscriptions"] = "b29db04a-a8f2-4bfe-bbad-21c99c1054b5";
    WidgetId["MyBookings"] = "14edb332-fdb9-2fe6-0fd1-e6293322b83b";
    WidgetId["Notifications"] = "14f2595a-a352-3ff1-9b3c-4d21861fe58f";
    WidgetId["Settings"] = "14f25dd2-f9b0-edc2-f38e-eded5da094aa";
    WidgetId["MyAddresses"] = "151290e1-62a2-0775-6fbc-02182fad5dec";
    WidgetId["MyOrders"] = "14e121c8-00a3-f7cc-6156-2c82a2ba8fcb";
    WidgetId["MyWallet"] = "6467c15e-af3c-4e8d-b167-41bfb8efc32a";
    WidgetId["SharedGallery"] = "11b7884b-eba1-4a47-b5c8-7afb395f966a";
    WidgetId["FileShare"] = "35a4cb97-c8cd-4ee9-ac3c-89c13c8493d6";
    WidgetId["TestPublic"] = "eed51e05-c783-4506-9fb3-0f5c47d6dea2";
    WidgetId["TestPrivate"] = "cc87eeb5-95a9-4f49-b7c3-5246eb39fee0";
    WidgetId["MyWishlist"] = "a63a5215-8aa6-42af-96b1-583bfd74cff5";
    WidgetId["ContributorProfile"] = "";
    WidgetId["ProfileCard"] = "14cefc05-d163-dbb7-e4ec-cd4f2c4d6ddd";
    WidgetId["MemberPage"] = "596a6688-3ad7-46f7-bb9c-00023225876d";
    WidgetId["SettingsPage"] = "2f6c5608-393f-4b15-bfd8-d4e15396787a";
})(WidgetId || (WidgetId = {}));
const widgetIdToPageIdAndAppDefIdMap = {
    [WidgetId.About]: { pageId: PageId.About, appDefId: AppDefinitionId.About },
    [WidgetId.MyAccount]: {
        pageId: PageId.MyAccount,
        appDefId: AppDefinitionId.MyAccount,
    },
    [WidgetId.MyRewards]: {
        pageId: PageId.MyRewards,
        appDefId: AppDefinitionId.Rewards,
    },
    [WidgetId.Groups]: {
        pageId: PageId.Groups,
        appDefId: AppDefinitionId.Groups,
    },
    [WidgetId.ForumPosts]: {
        pageId: PageId.ForumPosts,
        appDefId: AppDefinitionId.Forum,
    },
    [WidgetId.ForumComments]: {
        pageId: PageId.ForumComments,
        appDefId: AppDefinitionId.Forum,
    },
    [WidgetId.Events]: {
        pageId: PageId.Events,
        appDefId: AppDefinitionId.Events,
    },
    [WidgetId.FollowingFollowers]: {
        pageId: PageId.FollowingFollowers,
        appDefId: AppDefinitionId.Followers,
    },
    [WidgetId.FollowingFollowersLightbox]: {
        pageId: PageId.FollowingFollowersLightbox,
        appDefId: AppDefinitionId.ProfilePageBob,
    },
    [WidgetId.BlogComments]: {
        pageId: PageId.BlogComments,
        appDefId: AppDefinitionId.Blog,
    },
    [WidgetId.BlogLikes]: {
        pageId: PageId.BlogLikes,
        appDefId: AppDefinitionId.Blog,
    },
    [WidgetId.BlogPosts]: {
        pageId: PageId.BlogPosts,
        appDefId: AppDefinitionId.Blog,
    },
    [WidgetId.BlogDrafts]: {
        pageId: PageId.BlogDrafts,
        appDefId: AppDefinitionId.Blog,
    },
    [WidgetId.MyPosts]: {
        pageId: PageId.MyPosts,
        appDefId: AppDefinitionId.Blog,
    },
    [WidgetId.MyChallenges]: {
        pageId: PageId.MyChallenges,
        appDefId: AppDefinitionId.Programs,
    },
    [WidgetId.MyPrograms]: {
        pageId: PageId.MyPrograms,
        appDefId: AppDefinitionId.Programs,
    },
    [WidgetId.MySubscriptions]: {
        pageId: PageId.MySubscriptions,
        appDefId: AppDefinitionId.Subscriptions,
    },
    [WidgetId.MyBookings]: {
        pageId: PageId.MyBookings,
        appDefId: AppDefinitionId.Bookings,
    },
    [WidgetId.Notifications]: {
        pageId: PageId.Notifications,
        appDefId: AppDefinitionId.Notifications,
    },
    [WidgetId.MyAddresses]: {
        pageId: PageId.MyAddresses,
        appDefId: AppDefinitionId.Addresses,
    },
    [WidgetId.MyOrders]: {
        pageId: PageId.MyOrders,
        appDefId: AppDefinitionId.Stores,
    },
    [WidgetId.MyWishlist]: {
        pageId: PageId.MyWishlist,
        appDefId: AppDefinitionId.Stores,
    },
    [WidgetId.MyWallet]: {
        pageId: PageId.MyWallet,
        appDefId: AppDefinitionId.Wallet,
    },
    [WidgetId.Settings]: {
        pageId: PageId.Settings,
        appDefId: AppDefinitionId.Settings,
    },
    [WidgetId.SharedGallery]: {
        pageId: PageId.SharedGallery,
        appDefId: AppDefinitionId.SharedGallery,
    },
    [WidgetId.FileShare]: {
        pageId: PageId.FileShare,
        appDefId: AppDefinitionId.FileShare,
    },
    [WidgetId.TestPublic]: {
        pageId: PageId.TestPublic,
        appDefId: AppDefinitionId.TestVertical,
    },
    [WidgetId.TestPrivate]: {
        pageId: PageId.TestPrivate,
        appDefId: AppDefinitionId.TestVertical,
    },
    [WidgetId.ContributorProfile]: {
        pageId: PageId.ContributorProfile,
        appDefId: AppDefinitionId.ContributorProfile,
    },
    [WidgetId.ProfileCard]: {
        pageId: PageId.MyAccount,
        appDefId: AppDefinitionId.MyAccount,
    },
    [WidgetId.MemberPage]: {
        pageId: PageId.MemberPage,
        appDefId: AppDefinitionId.ProfilePageBob,
    },
    [WidgetId.SettingsPage]: {
        pageId: PageId.SettingsPage,
        appDefId: AppDefinitionId.ProfilePageBob,
    },
};
export const getPageIdFromWidgetId = (widgetId) => {
    return widgetIdToPageIdAndAppDefIdMap[widgetId].pageId;
};
export const getAppDefIdFromWidgetId = (widgetId) => {
    return widgetIdToPageIdAndAppDefIdMap[widgetId].appDefId;
};
export const getPageIdAndAppDefIdFromWidgetId = (widgetId) => {
    const pageId = getPageIdFromWidgetId(widgetId);
    const appDefId = getAppDefIdFromWidgetId(widgetId);
    return { pageId, appDefId };
};
//# sourceMappingURL=widgets.js.map
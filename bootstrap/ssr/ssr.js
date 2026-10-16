import { createInertiaApp } from "@inertiajs/vue3";
import createServer from "@inertiajs/vue3/server";
import { renderToString } from "vue/server-renderer";
const renderPromise = createInertiaApp({
  resolve: async (name, page) => {
    const pages = /* @__PURE__ */ Object.assign({ "./pages/Admin/Categories.vue": () => import("./assets/Categories-CsVzUegx.js"), "./pages/Admin/Companies.vue": () => import("./assets/Companies-paiDqGba.js"), "./pages/Admin/Dashboard.vue": () => import("./assets/Dashboard-DuAcIkMF.js"), "./pages/Admin/Jobs/Form.vue": () => import("./assets/Form-DzuN9uEC.js"), "./pages/Admin/Jobs/Index.vue": () => import("./assets/Index-DkEzuDN6.js"), "./pages/Admin/Login.vue": () => import("./assets/Login-cGPnDF1n.js"), "./pages/Admin/Platforms.vue": () => import("./assets/Platforms-CMDtarNc.js"), "./pages/Admin/Settings.vue": () => import("./assets/Settings-DqRqAkgX.js"), "./pages/Admin/Submissions/Index.vue": () => import("./assets/Index-ZXvWH0N8.js"), "./pages/Admin/Submissions/Show.vue": () => import("./assets/Show-B3Ar5iDq.js"), "./pages/Error.vue": () => import("./assets/Error-Dc53XX2G.js"), "./pages/Public/Categories.vue": () => import("./assets/Categories-Vlaj-B1m.js"), "./pages/Public/Home.vue": () => import("./assets/Home-BOA97Vnm.js"), "./pages/Public/JobList.vue": () => import("./assets/JobList-BZ_5lEbA.js"), "./pages/Public/JobShow.vue": () => import("./assets/JobShow-CC6D0qqA.js"), "./pages/Public/Page.vue": () => import("./assets/Page-Bmk8oUcF.js"), "./pages/Public/SavedJobs.vue": () => import("./assets/SavedJobs-CJA3_Nzl.js"), "./pages/Public/SubmitJob.vue": () => import("./assets/SubmitJob-CjqQYV5I.js"), "./pages/Public/SubmitJobDone.vue": () => import("./assets/SubmitJobDone-DxkNq9Gz.js") });
    const module = await pages[`./pages/${name}.vue`]?.();
    if (!module) throw new Error(`Page not found: ${name}`);
    return module.default ?? module;
  },
  title: (title) => title
});
renderPromise.catch((error) => console.error(error));
const renderPage = async (page) => {
  const render = await renderPromise;
  return render(page, renderToString);
};
{
  createServer(renderPage);
}
export {
  renderPage as default
};
//# sourceMappingURL=ssr.js.map

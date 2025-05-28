<template>
  <nav
    class="flex sm:mx-4 items-center flex-wrap sm:flex-nowrap print:hidden"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="flex items-center justify-between w-full">
      <router-link to="/">
        <img
          src="/logo.png"
          class="size-24 pb-4 object-contain dark:hidden"
          alt="Home"
        >
        <img
          src="/logo_dark.png"
          class="size-24 pb-4 object-contain hidden dark:block"
          alt="Home"
        >
      </router-link>

      <div
        class="grow sm:flex hidden"
      >
        <template
          v-for="category in categories"
          :key="category.title"
        >
          <div>
            <div class="px-2 sm:px-4 pt-4 pb-2 sm:py-6 peer">
              <button
                class="hover:cursor-auto mr-2 text-lg font-bold sm:text-md sm:font-normal"
                v-text="category.title"
              />
              <font-awesome-icon
                :icon="['fa', 'chevron-down']"
                class="peer invisible sm:visible"
              />
            </div>
            <div
              class="sm:hidden peer-hover:flex hover:flex flex rounded-sm
              sm:shadow-2xl bg-white dark:bg-zinc-800 flex-col sm:fixed z-50"
            >
              <a
                v-for="plan in category.plans"
                :key="plan.title"
                class="p-2 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-sm"
                :href="`#/plan/${plan.path}?startSemester=${startSemesterName}`"
                @click="onBurgerClick"
                v-text="plan.title"
              />
            </div>
          </div>
        </template>
      </div>

      <div class="flex justify-end mr-2">
        <ToggleDarkMode />
        <SignedOut>
          <div data-cy="Navigation-SignInButton">
            <SignInButton />
          </div>
        </SignedOut>
        <SignedIn>
          <div data-cy="Navigation-UserButton">
            <UserButton />
          </div>
        </SignedIn>
        <button
          class="sm:hidden p-4 flex justify-end"
          tabindex="0"
          aria-label="menu"
          aria-expanded="false"
          @click="onBurgerClick"
        >
          <font-awesome-icon
            :icon="['fa', 'bars']"
            size="2x"
          />
        </button>
      </div>
    </div>

    <div
      class="w-full basis-full sm:hidden mb-2"
      :class="{ 'hidden': !isBurgerActive }"
    >
      <template
        v-for="category in categories"
        :key="category.title"
      >
        <div>
          <div class="px-2 sm:px-4 pt-4 pb-2 sm:py-6 peer">
            <button
              class="hover:cursor-auto mr-2 text-lg font-bold sm:text-md sm:font-normal"
              v-text="category.title"
            />
            <font-awesome-icon
              :icon="['fa', 'chevron-down']"
              class="peer invisible sm:visible"
            />
          </div>
          <div
            class="sm:hidden peer-hover:flex hover:flex flex rounded-sm
            sm:shadow-2xl bg-white dark:bg-zinc-800 flex-col sm:fixed z-10"
          >
            <a
              v-for="plan in category.plans"
              :key="plan.title"
              class="p-2 hover:bg-gray-100 rounded-sm"
              :href="`#/plan/${plan.path}?startSemester=${startSemesterName}`"
              @click="onBurgerClick"
              v-text="plan.title"
            />
          </div>
        </div>
      </template>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/vue'
import { SemesterInfo } from "../helpers/semester-info";
import ToggleDarkMode from './ToggleDarkMode.vue';

/* eslint-disable max-len */
export default defineComponent({
  name: 'Navigation',
  components: {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
    ToggleDarkMode,
  },
  data() {
    return {
      isBurgerActive: false,
      startSemesterName: SemesterInfo.latestAutumnSemester().toString(),
      categories: [
        {
          title: 'Musterpläne Teilzeit',
          plans: [
            { title: 'Freie Modulwahl', path: 'RheKoI_OOP1_AutPy_CN1_DMI_An1I-FP_OOP2_DigCod_CySec_AutoSpr_An2I-WE1_AlgDat_Bsys1_AIFo_Dbs1_EnglScience-KommIng2-PmQm_SEP1_ExEv-SEProj_SEP2_DigBusI-SAI21_WI2-BAI21_PhAI' },
            { title: 'Software Engineering', path: 'RheKoI_OOP1_AutPy_CN1_DMI_An1I-FP_OOP2_DigCod_CySec_AutoSpr_An2I-WE1_AlgDat_Bsys1_AIFo_Dbs1_EnglScience-ParProg_SecSoW_Bsys2_AIAp_DatEng_KommIng2-PmQm_CoBau_MsTe_CPl_SEP1_ExEv-CPlA_DSy_SEProj_SEP2_DigBusI-UIP_AppArch_SAI21_WI2-CldSol_BAI21_PhAI' },
            { title: 'Cyber Security', path: 'RheKoI_OOP1_AutPy_CN1_DMI_An1I-FP_OOP2_DigCod_CySec_AutoSpr_An2I-WE1_AlgDat_Bsys1_AIFo_Dbs1_EnglScience-WE2_SecSoW_Bsys2_CN2_KommIng2-PmQm_PlFSec_CldInf_NIoSec_SEP1_ExEv-CldOp_HackL_DSy_SEProj_SEP2_DigBusI-CyDef_AppArch_SAI21_WI2-IncResp_BAI21_PhAI' },
            { title: 'Network and Cloud Infrastructure', path: 'RheKoI_OOP1_AutPy_CN1_DMI_An1I-FP_OOP2_DigCod_CySec_AutoSpr_An2I-WE1_AlgDat_Bsys1_AIFo_Dbs1_EnglScience-WE2_SModSim_DatAna_NetAut_CN2_KommIng2-PmQm_CldInf_NIoSec_SEP1_ExEv-CldOp_IBN_DSy_SEProj_SEP2_DigBusI-CyDef_AppArch_SAI21_WI2-CldSol_BAI21_PhAI' },
            { title: 'Data Science', path: 'RheKoI_OOP1_AutPy_CN1_DMI_An1I-FP_OOP2_DigCod_CySec_AutoSpr_An2I-WE1_AlgDat_Bsys1_AIFo_Dbs1_EnglScience-WE2_MathFML_DatAna_AIAp_DatEng_KommIng2-PmQm_ML_MsTe_UIP_SEP1_ExEv-DL_DSy_SEProj_SEP2_DigBusI-BlCh_AppArch_SAI21_WI2-CldSol_BAI21_PhAI' },
            { title: 'Frontend Engineering (vor HS23)', path: 'RheKoI_OOP1_AutPy_CN1_DMI_An1I-FP_OOP2_DigCod_CySec_AutoSpr_An2I-WE1_AlgDat_Bsys1_AIFo_Dbs1_EnglScience-WE2_SecSoW_Bsys2_AIAp_DatEng_KommIng2-PmQm_WE3_MsTe_UIP_SEP1_ExEv-UX_DSy_SEProj_SEP2_DigBusI-ComGra_AppArch_SAI21_WI2-CldSol_BAI21_PhAI' },
          ],
        },
        {
          title: 'Musterpläne Vollzeit',
          plans: [
            { title: 'Freie Modulwahl', path: 'RheKoI_OOP1_AutPy_CN1_DMI_An1I_Dbs1_EnglScience-FP_OOP2_DigCod_CySec_AutoSpr_An2I_KommIng2-WE1_AlgDat_Bsys1_AIFo_SEP1_ExEv-SEProj_SEP2_DigBusI-PmQm_SAI21_WI2-BAI21_PhAI' },
            { title: 'Software Engineering', path: 'RheKoI_OOP1_AutPy_CN1_DMI_An1I_Dbs1_EnglScience-FP_OOP2_DigCod_CySec_AutoSpr_An2I_DatEng_KommIng2-WE1_AlgDat_Bsys1_AIFo_MsTe_CPl_SEP1_ExEv-ParProg_SecSoW_Bsys2_AIAp_DSy_SEProj_SEP2_DigBusI-PmQm_CoBau_UIP_AppArch_SAI21_WI2-CPlA_CldSol_BAI21_PhAI' },
            { title: 'Cyber Security', path: 'RheKoI_OOP1_AutPy_CN1_DMI_An1I_Dbs1_EnglScience-FP_OOP2_DigCod_CySec_AutoSpr_An2I_CN2-WE1_AlgDat_Bsys1_AIFo_CldInf_NIoSec_SEP1_ExEv-WE2_SecSoW_Bsys2_DSy_SEProj_SEP2_DigBusI-PmQm_PlFSec_CyDef_AppArch_SAI21_WI2-CldOp_HackL_KommIng2_IncResp_BAI21_PhAI' },
            { title: 'Network and Cloud Infrastructure', path: 'RheKoI_OOP1_AutPy_CN1_DMI_An1I_Dbs1_EnglScience-FP_OOP2_DigCod_CySec_AutoSpr_An2I_CN2-WE1_AlgDat_Bsys1_AIFo_CldInf_NIoSec_SEP1_ExEv-WE2_SModSim_DatAna_NetAut_DSy_SEProj_SEP2_DigBusI-PmQm_CyDef_AppArch_SAI21_WI2-CldOp_IBN_KommIng2_CldSol_BAI21_PhAI' },
            { title: 'Data Science', path: 'RheKoI_OOP1_AutPy_CN1_DMI_An1I_Dbs1_EnglScience-FP_OOP2_DigCod_CySec_AutoSpr_An2I_DatEng_KommIng2-WE1_AlgDat_Bsys1_AIFo_MsTe_UIP_SEP1_ExEv-WE2_MathFML_DatAna_AIAp_DSy_SEProj_SEP2_DigBusI-PmQm_ML_AppArch_BlCh_SAI21_WI2-DL_CldSol_BAI21_PhAI' },
            { title: 'Frontend Engineering (vor HS23)', path: 'RheKoI_OOP1_AutPy_CN1_DMI_An1I_Dbs1_EnglScience-FP_OOP2_DigCod_CySec_AutoSpr_An2I_DatEng_KommIng2-WE1_AlgDat_Bsys1_AIFo_MsTe_UIP_SEP1_ExEv-WE2_SecSoW_Bsys2_AIAp_DSy_SEProj_SEP2_DigBusI-PmQm_WE3_ComGra_AppArch_SAI21_WI2-UX_CldSol_BAI21_PhAI' },
          ],
        },
      ],
    };
  },
  methods: {
    onBurgerClick() {
      this.isBurgerActive = !this.isBurgerActive;
    },
  },
});
</script>

<style>
.cl-rootBox {
  display: flex;
  align-items: center;
}

.cl-avatarBox {
  height: 2.5rem;
  width: 2.5rem;
}

.cl-userButtonTrigger {
  height: 2.5rem;
  width: 2.5rem;
}
</style>

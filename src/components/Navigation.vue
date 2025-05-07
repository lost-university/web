<template>
  <nav
    class="flex sm:mx-4 items-center flex-wrap sm:flex-nowrap"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="flex items-center justify-between w-full">
      <router-link to="/">
        <img
          src="../assets/logo.png"
          class="size-24 pb-4 object-contain"
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
              class="sm:hidden peer-hover:flex hover:flex flex rounded-sm sm:shadow-2xl bg-white flex-col sm:fixed z-50"
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
        <div>
          <div class="px-2 sm:px-4 pt-4 pb-2 sm:py-6 peer">
            <button
              class="hover:cursor-auto mr-2 text-lg font-bold sm:text-md sm:font-normal"
              data-cy="SavedPlans-Dropdown-Button"
            >
              Saved Plans
            </button>
            <font-awesome-icon
              :icon="['fa', 'chevron-down']"
              class="peer invisible sm:visible"
            />
          </div>
          <div
            class="sm:hidden peer-hover:flex hover:flex flex rounded-sm sm:shadow-2xl bg-white flex-col sm:fixed z-50"
          >
            <ul>
              <li
                v-for="plan in modulePlans"
                :key="plan.id"
                class="flex items-center justify-between"
              >
                <router-link
                  :to="plan.content"
                  class="p-2 hover:bg-gray-100 rounded-sm"
                >
                  {{ plan.name }}
                </router-link>
                <button
                  class="p-2 hover:bg-gray-100 rounded-sm"
                  @click="deletePlan(plan.id)"
                >
                  Delete
                </button>
              </li>
            </ul>
            <form
              class="flex items-center justify-between"
              @submit.prevent="savePlan"
            >
              <input
                v-if="isEditingName"
                v-model="planName"
                type="text"
                class="p-2 hover:bg-gray-100 rounded-sm"
                placeholder="Enter plan name"
                data-cy="SavePlan-Name"
              >
              <button
                v-if="isEditingName"
                type="submit"
                data-cy="SavePlan-Submit"
              >
                Submit
              </button>
            </form>
            <button
              v-if="!isEditingName"
              class="p-2 hover:bg-gray-100 rounded-sm text-left"
              data-cy="SavePlan-Button"
              @click="() => isEditingName = !isEditingName"
            >
              + Save current plan
            </button>
          </div>
        </div>
      </div>

      <div class="flex justify-end mr-2">
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
            class="sm:hidden peer-hover:flex hover:flex flex rounded-sm sm:shadow-2xl bg-white flex-col sm:fixed z-10"
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
import { SignedIn, SignedOut, SignInButton, useAuth, UserButton } from '@clerk/vue'

import { SemesterInfo } from "../helpers/semester-info";

import type { Plan } from "../helpers/plan-store"
import { PlanStore } from "../helpers/plan-store"

/* eslint-disable max-len */
export default defineComponent({
  name: 'Navigation',
  components: {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
  },
  setup() {
    const { getToken } = useAuth();
    const fetchData = async () => {
      const token = await getToken.value()
      await new PlanStore().savePlan('this.planName','irgendöpis', token as string);
    }
    return {
      fetchData,
      getToken,
    };
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
      modulePlans: [] as Plan[],
      isEditingName: false,
      planName: '',
    };
  },
  mounted() {
    this.getPlans();
  },
  methods: {
    onBurgerClick() {
      this.isBurgerActive = !this.isBurgerActive;
    },
    async getPlans() {
      try {
        const token = await this.getToken() as string;
        this.modulePlans = await new PlanStore().fetchSavedPlans(token);
      } catch (error) {
        console.error('Error fetching plans: ', error)
      }
    },
    async savePlan() {
      const temp = async (token) => {
        console.log(this.$route.path.replace('/plan/', ''));
        await new PlanStore().savePlan(this.planName, this.$route.path.replace('/plan/', ''), token);
        await this.getPlans();
        this.isEditingName = false;
        this.planName = '';
      }
      this.fetchData()
    },
    async deletePlan(/*planId: string*/) {
      /*const token = await this.getToken() as string;
      await new PlanStore().deletePlan(planId, token)
      await this.getPlans();*/
    },
  }
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

import { sxqxzk,treecx} from "@/api/power/institution";
import { saveObjArr} from "@/router";
import { mapState,mapMutations } from "vuex";
export default {
  watch: {
    
  },
  created(){
		sxqxzk().then(res => {
			this.set_regTree(res.data.children)
			saveObjArr('regTree', res.data.children)
			treecx().then(res => {
				this.set_insData(res.data)
				saveObjArr('insData', res.data)
  		})
		});
  	
  },
  beforeMount() {
    
  },
  beforeDestroy() {
    
  },
  mounted() {
    
  },
  methods: {
  	...mapMutations(['set_regTree','set_insData']),
  }
}

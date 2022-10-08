<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      vnodes.push(<i class={icon}></i>)
    }else{
    	vnodes.push(
    		<b style={"display: inline-block;width: 6px;height: 6px;margin-right: 8px;margin-left: 8px;position: relative;border-radius: 50%;background: #acb8b8;"}></b>)
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>

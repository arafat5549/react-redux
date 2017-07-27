const DEMO_ADDTEXT = 'ADD_TEXT'
const demoAction= (text) => {
  return {
    type: DEMO_ADDTEXT,
    text
  }
}
export {demoAction}
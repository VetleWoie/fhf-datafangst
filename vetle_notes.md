# Test user:
> This is mainly for the barentswatch pilot API not the production API, however, this user exists on  the production API aswell but might not have any vessels connected to it.

- User: vetle.hofsoy-woie@sintef.no
- Pwd: Password is delivered in person.

# Efficiency:
## Files
- ```/components```
  - ```/efficiency```
    - ```/EfficiencyMenu.tsx```
      - Component for displaying efficiency metrics
  - ```/MyPage```
    - ```/MyEfficiency.tsx```
      > Buttons accesses from users page
  - ```/store```
    - ```/efficiency```
        > Here we can define new states for our benchmarking development
      - ```/state.ts```
        > All new states must be defined in this file
        - Methods and objects of interest:
          - ```enum EfficiencyViewState```
          - ```interface EfficiencyState```
          - ```const initalEfficiencyState: EfficiencyState```
      - ```/selectors.ts```
        > Selectors are used to get information from the current state.
        - Methods and objects of interest:
          - ```const selectEfficiency```
      - ```/actions.ts```
        > In Redux actions are plain JS objects with a 'type' field.  The type field is a string determining the type of the action. It can be anything we like.
        >>Actions should define changes that can happen to the state
      - ```/reducers.ts```
        > Reducers are functions that takes the current state and an action and returns a new state ```(state, action) => newState```
  - ```/EfficiencyMenu```
    - Efficiency menu that pop up on the right side
      - Type:
        - Drawer
      - Thoughts:
        - Different efficiency plots based on the efficiency buttons pressed
  - ```/containers```
    - ```App```
      - ```Homeview.tsx```
        > This is the parent of all components in the client
        - Main page component

## States
- ```selectedEffiency```
  - Type of efficiency measure to display
      - Types:
        - ```enum EfficencyViewState```
          - ```timePerDay```
          - ```distancePerDay```
        - ```undefined```
    - Chosen by the togglebuttons in [MyEfficiency.tsx](./fhf-datafangst-client/src/components/MyPage/MyEfficiency.tsx)

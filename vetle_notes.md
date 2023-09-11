# Test user:
> This is mainly for the barentswatch pilot API not the production API, however, this user exists on  the production API aswell but might not have any vessels connected to it.

- User: vetle.hofsoy-woie@sintef.no
- Pwd: Password is delivered in person.

# Dev environment
There are a dockerfile and a docker-compose file which opens a developent environment at [localhost:3000](http://localhost:3000). User ``` Docker compose up``` to start this dev container. The first time you start the container you need to run ```npm install``` within the container to install the necessary dependencies.

The container mounts this folder to its filesystem so that you can edit files locally and the changes will automatically happen in the container as well.
# Efficiency:
## Files
- ```/components```
  - ```/Efficiencies```
    - ```/EfficiencyMenu.tsx```
      - Component for displaying efficiency metrics.
    - ```Efficiencygauge.tsx```
      - Component for a guage that displays a users score in a specific metric.
    - ```EfficiencyLeaderboard.tsx```
      - Component that displays a leaderboard of users on a specific metric.
  - ```/MyPage```
    - ```/MyEfficiency.tsx```
      > Buttons for choosing which efficiencies to display.
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
          - ```const selectEfficiencies```
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
- ```selectedEffiencies:EfficiencyViewState[]```
  - List of efficiency measures to display
      - Types:
        - ```enum EfficencyViewState```
          - ```timePerDay```
          - ```distancePerDay```
          - ```fishPerDay```
        - ```undefined```
    - Chosen by the togglebuttons in [MyEfficiency.tsx](./fhf-datafangst-client/src/components/MyPage/MyEfficiency.tsx)

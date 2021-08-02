# xpmint

## What?

`xpmint` is a small Javascript client-side library for assigning users to A/B tests using a small amount of configuration and zero network requests.

## Why?

I didn't want to install a large cumbersome library or have to interact with a third-party remote server just to assign users to experiment groups.

## How?

```bash
yarn add xpmint
# or
npm install xpmint
```
and then ...
```javascript
import Xpmint from 'xpmint'

const xpmint = new Xpmint({
    experiments: {
        test: { // experiment name
            groups: { // experiment groups
                control: 50, // group name and proportion
                variant: 50
            }
        }
        // ... however many more experiments you want
    }
})

// this is optional, but ensures that the same user id
// will be assigned the same group across different clients
xpmint.setUserId('example-user-id')
const group = xpmint.getExperimentGroup('test')
console.log('user is in group: ' +  group)

// you can also manually assign a user to a group
xpmint.assignExperimentGroup('test', 'variant')
```

## Who?

[theodore brockman](https://theo.lol)
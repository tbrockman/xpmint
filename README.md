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
                control: 50, // group name
                variant: 50 // followed by proportion
            }
        }
        // ... however many more experiments you want
    }
})

// setUserId() is optional, but ensures that the same user
// can be assigned the same group across different clients
xpmint.setUserId('example-user-id')
// if not set, user id will default to the one xpmint generates internally

// get the group for our current user
const group = xpmint.getExperimentGroup('test')
console.log('user is in group: ' +  group)

// you can also manually assign a user to a group
xpmint.assignExperimentGroup('test', 'variant')
console.assert(xpmint.getExperimentGroup('test') == 'variant')
```

## Who?

[theodore brockman](https://theo.lol)
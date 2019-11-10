import {
  VictoryAxis, VictoryChart, VictoryLine, VictoryTheme,
} from 'victory-native';
import moment from 'moment';
import { View, Dimensions } from 'react-native';
import React from 'react';
import { THEME_COLOR } from '../constants';
import { HealthModel } from '../state/modules/health/types';

const { width } = Dimensions.get('window');

const Chart = ({ health }: { health: HealthModel[] }) => (
  <View style={{ width }}>
    <View pointerEvents="none">
      <VictoryChart
        padding={{
          top: 20,
          left: 50,
          bottom: 40,
          right: 10,
        }}
        theme={VictoryTheme.material}
        height={250}
        width={width}
      >
        {health.length > 1 && (
          <VictoryLine
            style={{
              data: { stroke: THEME_COLOR },
              parent: { border: '1px solid #ccc' },
            }}
            data={[...health].reverse().map((r) => ({
              x: `${moment(r.date).month() + 1}/${moment(r.date).date()}`,
              y: r.weight,
            }))}
          />
        )}
        <VictoryAxis orientation="bottom" tickCount={6} />
        <VictoryAxis orientation="left" dependentAxis tickCount={6} />
      </VictoryChart>
    </View>
  </View>
);

export default Chart;

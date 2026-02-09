import { TrendingUp, Target, Shield, Zap } from 'lucide-react';

export function AboutUs() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
            <TrendingUp className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Link Predictor</h1>
          <p className="text-xl text-gray-600">
            hdfjisa sdahufihsaiuhiuasof uasfuasiofpsoa
          </p>
        </div>

        {/* Mission */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            hfuiahsuin fuiwanfie fiawifkenuwfianwiiufd sduijhiusfuiasuidfhiuhsaiuhui
          </p>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Accurate Predictions</h3>
                <p className="text-gray-600 text-sm">
                  asfd weafawfsadfsa df safsda fsfda fdaf
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Fast Analysis</h3>
                <p className="text-gray-600 text-sm">
                  a sdfasdf asf sadfsad fsd fsaf as fas 
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Privacy First</h3>
                <p className="text-gray-600 text-sm">
                  a sdfasfasf asfd as efa sf s.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Continuous Improvement</h3>
                <p className="text-gray-600 text-sm">
                  esa fefaseeeeeeeee sef s fda sdf
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technology */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">aaaaaaaaaaaaaaaaaaa</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            ef aaaas adf sf asf asdf asdfsdaf asfsda gh hssh 
          </p>
        
        </div>
      </div>
    </div>
  );
}

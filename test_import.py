from main import SocialScaleBooster

booster = SocialScaleBooster()
result = booster.boost_post("Launching my new product!", "friendly")
print(result['final_post'])